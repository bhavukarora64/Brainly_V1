import express from "express";
import pool from "./database"
import { v4 as uuidv4 } from 'uuid';
import {ResultSetHeader} from 'mysql2';
import JWT from 'jsonwebtoken';
import userAuth from './middleware'
import cors from 'cors';
import bcrypt from 'bcryptjs';
import sendEmail from './sendEmail';
import { WebSocketServer, WebSocket } from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_BASE_URL, credentials: true }));
app.options('*', cors());

interface JoinRoomMessage {
  type: 'join';
  payload: {
    roomId: string;
  };
}

interface MessageToRoom {
  type: 'message';
  payload: {
    message: string;
  };
}

type AppMessage = JoinRoomMessage | MessageToRoom;

interface RegisteredUser {
  socket: WebSocket;
  roomId: string;
}

const wss = new WebSocketServer({ port: 8080 });
const registeredUsers: RegisteredUser[] = [];

wss.on('connection', (socket: WebSocket) => {
  console.log('User connected');

  // Handle incoming messages
  socket.on('message', (rawData: Buffer) => {
    try {
      const data = rawData.toString();
      const message: AppMessage = JSON.parse(data);

      if (!isValidMessage(message)) {
        console.error('Invalid message format:', message);
        socket.send(JSON.stringify({ error: 'Invalid message format' }));
        return;
      }

      switch (message.type) {
        case 'join':
          handleJoinRoom(socket, message.payload.roomId);
          break;

        case 'message':
          handleRoomMessage(socket, message.payload.message);
          break;

        default:
          console.error('Unknown message type:', (message as any).type);
          socket.send(JSON.stringify({ error: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({ error: 'Failed to process message' }));
    }
  });

  // Handle connection close
  socket.on('close', () => {
    const index = registeredUsers.findIndex(user => user.socket === socket);
    if (index !== -1) {
      registeredUsers.splice(index, 1);
    }
    console.log('User disconnected');
  });

  // Handle errors
  socket.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
  });
});

function isValidMessage(message: any): message is AppMessage {
  return (
    typeof message === 'object' &&
    (message.type === 'join' || message.type === 'message') &&
    typeof message.payload === 'object'
  );
}

function handleJoinRoom(socket: WebSocket, roomId: string) {
  // Remove existing entries for this socket
  const existingIndex = registeredUsers.findIndex(user => user.socket === socket);
  if (existingIndex !== -1) {
    registeredUsers.splice(existingIndex, 1);
  }

  registeredUsers.push({ socket, roomId });
  console.log(`User joined room: ${roomId}`);
  socket.send(JSON.stringify({ status: `Joined room: ${roomId}` }));
}

function handleRoomMessage(senderSocket: WebSocket, message: string) {
  const sender = registeredUsers.find(user => user.socket === senderSocket);
  
  if (!sender) {
    console.error('Message from unregistered user');
    senderSocket.send(JSON.stringify({ error: 'Join a room before sending messages' }));
    return;
  }

  registeredUsers.forEach(user => {
    if (user.roomId === sender.roomId && user.socket.readyState === WebSocket.OPEN) {
      try {
        user.socket.send(JSON.stringify({
          type: 'message',
          payload: { message }
        }));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  });
}

console.log('WebSocket server running on port 8080');

app.get("/", (req, res) => {
    res.send("Welcome to the Brainly's Server. Please access the endpoint for your tasks.");
})

app.post("/api/v1/signup", async (req,res) => {
    const connection = await pool.getConnection();

    function validatePassword(password: string): boolean {

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,20}$/;
        return passwordRegex.test(password);

    }

    try{

    const {username, password} : {username: string, password: string} = req.body;

    if(username.length > 3 && username.length < 10 && validatePassword(password)){

        const hashedPassword = await bcrypt.hash(password,10);
        const [rows, views]= await connection.execute(`SELECT password FROM Users where username = '${username}'`);
         if(Array.isArray(rows) && rows.length > 0 ){
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword)
            if(isPasswordMatch)
            {
                    res.status(403).json({
                    "success" : 0,
                    "error" : 1,
                    "message": "User already exists, Please login!"
                })
            }
         }else{
            const uuid:string = uuidv4()
            const [result] = await connection.execute<ResultSetHeader>(`INSERT INTO Users (userId, username, password, share) VALUES ('${uuid}', '${username}', '${hashedPassword}', 0);`);
            if(result.affectedRows > 0){
                res.status(200).json({
                    "success" : 1,
                    "error" : 0,
                    "message": "You are successfully registered!"
                })
            }else{
                res.status(500).json({
                    "success" : 0,
                    "error" : 1,
                    "message": "Internal Server Error..Please try again after sometime."
                })
            }

         }

    }
    else{
        res.status(411).json({
            "success" : 0,
            "error" : 1,
            "message": "Provided Username or Password does not match the provided criteria!"
        })
    }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.post("/api/v1/signin", async (req,res) => {
    const connection = await pool.getConnection();

    try{

        const {username, password}: {username:string, password:string} = req.body;
        
        if(!username || !password){
            res.status(403).json({
                "success":0,
                "error":1,
                "message": "Username or Password cannot be left blank !"
            })
        }else{

            const [rows] = await connection.execute<ResultSetHeader>(`SELECT * FROM Users WHERE username = '${username}'`);


            if(Array.isArray(rows) && rows[0]){

                const isUserValid = await bcrypt.compare(password, rows[0].password)

                if(isUserValid)
                {
                    const userId = rows[0].userId;

                    const token  =  JWT.sign(userId, 'JWTSECRET' )

                    if(token){
                        res.status(200).json({
                            "success":1,
                            "error":0,
                            "message": "Congratulations ! You have logged in successfully.",
                            "Authorization": token
                        })
                    }else{
                        res.status(500).json({
                            "success":0,
                            "error":1,
                            "message": "Internal Server Error..try after some time!"
                        })
                    }
                }else{
                    res.status(403).json({
                        "success":0,
                        "error":1,
                        "message": "Wrong emailId or Password !"
                    })
                }
                
            }else{
                res.status(403).json({
                    "success":0,
                    "error":1,
                    "message": "Wrong emailId or Password !"
                })
            }
        }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.post("/api/v1/content", userAuth ,async (req,res) => {
    const connection = await pool.getConnection();

    try{
        
        const {type, link, title, tags, addedon, userId} : {type:string, link:string, title:string, tags:string[], userId:string, addedon:Date} = req.body;

        if(!type || !link || !title || !tags || !userId){
            res.status(411).json({
                "success" : 0,
                "error" : 1,
                "message": "Mandatory fields cannot be left blank !"
            })
        }else{
            const uuid = uuidv4();
            const [ResultSetHeader]  = await connection.execute<ResultSetHeader>(`INSERT INTO Content VALUES ('${uuid}', '${link}', '${type}', '${title}', '${tags}','${userId}','${addedon}')`);
            
            if(ResultSetHeader.affectedRows > 0){
                res.status(200).json({
                    "success" : 1,
                    "error" : 0,
                    "message": "Sucessfully updated the brain !"
                })
            }
            else{
                res.status(403).json({
                    "success" : 0,
                    "error" : 1,
                    "message": "Failed ! Retry after some time !"
                })
            }
        }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.get("/api/v1/content", userAuth ,async (req,res) => {
    const connection = await pool.getConnection();

    try{
        
        const {userId} = req.body;

        if(!userId){
            res.status(500).json({
                "success" : 0,
                "error" : 1,
                "message": "Something went wrong ! Refresh or Re-login if the issue persists !"
            })
        }else{
            
            const [rows]  = await connection.execute(`SELECT * FROM Content WHERE userId = '${userId}'`);
            if(Array.isArray(rows) && rows){
                res.status(200).json({
                    "success" : 1,
                    "error" : 0,
                    "message": "Sucessfully scanned the brain !",
                    "content": rows
                })
            }
            else{
                res.status(403).json({
                    "success" : 0,
                    "error" : 1,
                    "message": "Failed ! Retry after some time !"
                })
            }
        }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.delete("/api/v1/content/:contentid", userAuth ,async (req,res) => {
    const connection = await pool.getConnection();

    try{
        const {contentid} = req.params;
        const {userId} : {userId:string} = req.body;

        if(!contentid){
            res.status(500).json({
                "success" : 0,
                "error" : 1,
                "message": "Something went wrong ! Refresh or Re-login if the issue persists !"
            })
        }else{
            const [ResultSetHeader]  = await connection.execute<ResultSetHeader>(`DELETE FROM Content WHERE contentId = '${contentid}' AND userId = '${userId}'`);

            if(ResultSetHeader.affectedRows > 0){
                res.status(200).json({
                    "success" : 1,
                    "error" : 0,
                    "message": "Sucessfully Cleaned the brain !"
                })
            }
            else{
                res.status(403).json({
                    "success" : 0,
                    "error" : 1,
                    "message": "Failed ! Trying to delete a document you do not own"
                })
            }
        }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.put("/api/v1/brain/share", userAuth ,async (req,res) => {
    const connection = await pool.getConnection();

    try{
        
        const {share, userId} : {share: boolean, userId:string} = req.body;

        if(!userId){
            res.status(500).json({
                "success" : 0,
                "error" : 1,
                "message": "Something went wrong ! Refresh or Re-login if the issue persists !"
            })
        }else{
            if(share){
                const sharableHash = uuidv4();
                const [result]  = await connection.execute<ResultSetHeader>(`UPDATE Users SET share = true, sharableHash = '${sharableHash}' WHERE userId = '${userId}'`);
                if(result.affectedRows > 0){
                    res.status(200).json({
                        "success" : 1,
                        "error" : 0,
                        "message": "Sucessfully shared the brain !",
                        "link": `${process.env.FRONTEND_BASE_URL}/shared-dashboard/${sharableHash}`,
                        "sharableHash": sharableHash
                    })
                }
                else{
                    res.status(403).json({
                        "success" : 0,
                        "error" : 1,
                        "message": "Failed ! Please refresh and try again !"
                    })
                }
            }else{
                const [result]  = await connection.execute<ResultSetHeader>(`UPDATE Users SET share = false, sharableHash = null WHERE userId = '${userId}'`);
                if(result.affectedRows > 0){
                    res.status(200).json({
                        "success" : 1,
                        "error" : 0,
                        "message": "Sucessfully un-shared the brain !"
                    })
                }
                else{
                    res.status(403).json({
                        "success" : 0,
                        "error" : 1,
                        "message": "Failed ! Please refresh and try again !"
                    })
                }
            }
        }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.get("/api/v1/brain/:shareLink" ,async (req,res) => {
    const connection = await pool.getConnection();

    try{
        
        const {shareLink} = req.params;

        const [rows] = await connection.execute<ResultSetHeader>(`SELECT userId FROM Users WHERE sharableHash = '${shareLink}' AND share = true`);

        if(Array.isArray(rows) && rows[0].userId){
             const userId = Array.isArray(rows) && rows[0].userId;
             const [QueryResult] = await connection.execute(
                `SELECT u.userId, u.username, u.sharableHash, c.contentId, c.title, c.link, c.tags, c.type
                 FROM Users u
                 INNER JOIN Content c ON u.userId = c.userId
                 WHERE u.userId = ?`, 
                [userId]
              );
              
                
                res.status(200).json({
                    "success" : 1,
                    "error" : 0,
                    "message": "Successfully fetched the result !",
                    "content": QueryResult
                })
        }else{
            res.status(500).json({
                "success" : 0,
                "error" : 1,
                "message": "Share link is invalid or sharing is disabled !"
            })
        }


    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

app.post("/api/v1/me", userAuth ,async (req,res) => {
    const connection = await pool.getConnection();

    try{

        const {userId} : {userId: string} = req.body;

        if(!userId){
            res.status(403).json({
                "success" : 0,
                "error" : 1,
                "message": "Please Re-login!"
            })
        }else{
            res.status(200).json({
                "success" : 1,
                "error" : 0,
                "message": "User Verified!",
                userData: req.body.loggedInUser
            })
        }

    }catch(e:any){
        res.status(500).json({
            "success" : 0,
            "error" : 1,
            "message": e.message
        })
    }finally{
        connection.release();
    }
})

// @ts-ignore
app.post('/api/v1/send-email', async (req, res) => {
    const { subject, message, name, email } = req.body;
  
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
  
    const to = 'bhavuk@brainlyy.bhavukarora.eu';
    const fullMessage = `You received a new message from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  
    try {
      const result = await sendEmail(to, subject || `New Feedback from ${name}`, fullMessage);
      res.status(200).json({ success: true, result });
    } catch (error) {
        // @ts-ignore
      res.status(500).json({ success: false, error: error.message });
    }
  });

app.listen(3001, () => {
    console.log('Server is running on port 3000');
  });
