import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import ShareIcon from '../assets/icons/ShareIcon';
import AddIcon from '../assets/icons/Addicon';
import Card from './Card';
import BinIcon from '../assets/icons/Bin';
import SideBar from './SideBar';
import LoginIcon from "../assets/icons/LoginIcon";
import CreateContentModal from './CreateContentModal';
import Authentication from './Authentication';
import { useRecoilState} from 'recoil';
import { loginAtom } from '../assets/store/atoms/loggedIn';
import Twitter from '../assets/icons/Twitter';
import Document from "../assets/icons/Document";
import Youtube from "../assets/icons/Video";
import Link from "../assets/icons/Link";
import { cardDataAtom } from '../assets/store/atoms/cardData';
import { sharedBrain } from '../assets/store/atoms/sharedBrain';
import {useUserData} from '../hooks/useUserData';
const backendWssURL = import.meta.env.VITE_BACKEND_BASE_WSS_URL;
const backendBaseURL = import.meta.env.VITE_BACKEND_TEST_URL;
const iconTypes = {
  "Twitter": <Twitter imageProp='lg' />,
  "Youtube": <Youtube imageProp='lg' />,
  "Link": <Link imageProp='lg' />,
  "Document": <Document imageProp='lg' />
};

const Notification: React.FC<{ link: string; onClose: () => void }> = ({ link, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 10000;
    const intervalTime = 100;
    const decrement = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - decrement, 0));
    }, intervalTime);

    const timer = setTimeout(onClose, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-100 p-4 rounded shadow-lg border border-gray-300 w-64">
      <div className="h-1 bg-blue-500" style={{ width: `${progress}%`, transition: "width 0.1s linear" }}></div>
      <p className="mt-2">Sharable link copied to clipboard!</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full">Go to Link</button>
      </a>
    </div>
  );
};

function Dashboard() {
  const {userCheck, fetchContent} = useUserData();
  const [visible, setVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [cardData, setCardData] = useRecoilState(cardDataAtom);
  const [loginState, setLoginState] = useRecoilState(loginAtom);
  const [isBrainShared, setIsBrainShared] = useRecoilState(sharedBrain);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const userId = useRef('');

  async function fetchData() {
    const data = await fetchContent();
    setCardData(data);

    const loggedInUserData = await userCheck();
    if (loggedInUserData) {
      setLoginState(true);
      setIsBrainShared(!!loggedInUserData.userData?.share);
      userId.current = loggedInUserData.userData.sharableHash
    }
  }
  
  async function checkUserAndFetchData() {
    const loggedInUserData = await userCheck();
    if (loggedInUserData) {
      setLoginState(true);
      setIsBrainShared(!!loggedInUserData.userData?.share);
    }
    fetchData();
  }

  useEffect(() => {
    checkUserAndFetchData();
  }, [loginState]);
    // @ts-expect-error: Error Expected
  async function joinWebSocket(ws){
    await fetchData();

    if (userId.current) {
          const jsonData = {
            type: "join",
            payload: { roomId: userId.current}
          };
          ws.send(JSON.stringify(jsonData));
        }
  };
  
// WebSocket Initial Connect at Hook
  useEffect(() => {
    const ws = new WebSocket(`${backendWssURL}`);


    ws.onopen = () => {
      console.log("WebSocket Connected");
      setWebSocket(ws);
      joinWebSocket(ws)
    }

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if(webSocket){
      console.log("sending the message")

      const jsonData = {
        type: "message",
        payload: {
          "message": cardData
        }
      };

      webSocket.send(JSON.stringify(jsonData));
    }
  }, [cardData])

  function loginOrlogout() {
    if (!loginState) {
      setLoginVisible(true);
    } else {
      localStorage.removeItem("Authorization");
      setLoginState(false);
      window.location.reload();
    }
  }

  async function shareBrain() {
    const loggedInUserData = true; //BackednRequest 1
    if (loggedInUserData) {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(`${backendBaseURL}/api/v1/brain/share`, { //BackendRequest 2
        method: "PUT",
        headers: {
          "authorization": token || '',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ share: !isBrainShared })
      });
      const userData = await response.json();

      setIsBrainShared(prevValue => !prevValue);
      
      if (!isBrainShared) {
        await navigator.clipboard.writeText(userData.link);
        setShareLink(userData.link);
        setIsNotificationVisible(true);

        const jsonData = {
          type: "join",
          payload: { roomId: userData.sharableHash }
        };

        console.log("connecting")

        webSocket?.send(JSON.stringify(jsonData)); //BackendRequest 3
      }
    } else {
      alert("You must be logged in!");
    }
  }

  function getCleanYouTubeURL(url: string) {
    const urlObj = new URL(url);
    console.log(urlObj)
    const videoId = urlObj.searchParams.get("v");
    console.log(videoId)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  }

  return (
    <div className='grid grid-cols-12'>
      <CreateContentModal visible={visible} setVisible={setVisible} fetchData={fetchData} />
      <Authentication visible={loginVisible} setVisible={setLoginVisible} />
      <div className='col-span-2 border-[#e9ebed] border-r-2'>
        <SideBar />
      </div>
      <div className='col-span-10 bg-gray-50'>
        <div className='flex justify-between m-4'>
          <h1 className='text-2xl font-bold text-ellipsis'>All Notes</h1>
          <div className="flex gap-4">
            <Button title={isBrainShared ? "Brain Shared" : "Share Brain"} toolTipTitle="Share/Unshare Brain" onClick={shareBrain} size="md" type={isBrainShared ? "logout" : "secondary"} frontIcon={<ShareIcon imageProp="md"/>} style="hidden md:block" />
            <Button title="Add Content" onClick={() => setVisible(true)} toolTipTitle="Add Content" size="md" type="primary" frontIcon={<AddIcon imageProp="md" />} style="hidden md:block"/>
            <Button title="" toolTipTitle="Login/Logout" onClick={loginOrlogout} size="md" type={loginState ? "logout" : "primary"} frontIcon={<LoginIcon imageProp="md" />}  style="hidden md:block"/>
          </div>
        </div>
        {isNotificationVisible && shareLink && <Notification link={shareLink} onClose={() => setIsNotificationVisible(false)} />}
        <div className='flex m-10 gap-5 flex-wrap '>
        {!loginState
          ?
          <Card
            id=""
            title="First Twitter Link"
            body="https://twitter.com/SpaceX/status/1732824684683784516?ref_src=twsrc%5Etfw"
            tags="Twitter, Social Media, News"
            createdAt={new Date()}
            contentType="Twitter"
            contentTypeIcon={<Twitter imageProp="md" />}
            firsticon={<BinIcon imageProp="lg" />}
            secondicon={<ShareIcon imageProp="lg" />}
          />
          :
          cardData.length ?
            cardData.map((card) => {
              // @ts-expect-error: Error Expected
              const clearURL = getCleanYouTubeURL(card.link);
              console.log(clearURL)

              return(
              <Card
                // @ts-expect-error: card.contentId might be undefined
                key={card.contentId}
                  // @ts-expect-error: card.contentId might be undefined
                id={card.contentId}
                  // @ts-expect-error: card.title might be undefined
                title={card.title}
                  // @ts-expect-error: card.link might be undefined
                body={clearURL || card.link}
                  // @ts-expect-error: card.tags might be undefined
                tags={card.tags}
                // @ts-expect-error: card.tags might be undefined
                createdAt={card.addedon || "0000-00-00"}
                  // @ts-expect-error: card.type might be undefined
                contentType={card.type}
                  // @ts-expect-error: card.type might be undefined
                contentTypeIcon={iconTypes[card.type]}
                firsticon={<BinIcon imageProp="lg" />}
                secondicon={<ShareIcon imageProp="lg" />}
              />
            )}) :
            <h1 className='text-gray-400'>hmmmm....Seems like you have nothing in your mind right now !</h1>
        }
      </div>
      </div>
    </div>
  );
}

export default Dashboard;