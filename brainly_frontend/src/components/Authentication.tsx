import Close from "../assets/icons/Close";
import Button from "./Button";
import Input from "./Input";
import { Dispatch, SetStateAction, useState } from 'react';
import { loginAtom } from "../assets/store/atoms/loggedIn";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

interface ModalProps {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Authentication(props: ModalProps) {

    const [selectedtypes, setSelectedtypes] = useState<string[]>([]);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword ] = useState<string>('');
    const [selectedSection, setSelectedSection ] = useState<string>("");
    const setLoginState = useSetRecoilState(loginAtom);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate()

    return (
        <>
            {props.visible && (
                <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-96">
                        {selectedSection === "" && (
                                <>
                                    <div className="flex justify-end">
                                        <button onClick={toggle}>
                                            <Close imageProp="lg" />
                                        </button>
                                    </div>
                                    <div className="flex justify-evenly m-15">
                                        <Button onClick={() => setSelectedSection("Register")} title="Register" toolTipTitle="Register" size="lg" type="primary" />
                                    </div>
                                    <div className="flex justify-evenly m-15">
                                        <Button onClick={() => setSelectedSection("Login")} title="Login" toolTipTitle="Login" size="lg" type="primary" />
                                    </div>
                                </>
                            )}
                        {selectedSection === "Register" && (
                            <>
                                <div className="flex justify-end mb-5">
                                    <button onClick={toggle}>
                                        <Close imageProp="lg" />
                                    </button>
                                </div>
                                <Input onChange={(e) => {setUsername(e.target.value)}} value={username}  type="text" placeholder="Username" />
                                <br></br>
                                <Input onChange={(e) => {setPassword(e.target.value)}}  value={password}type="password" placeholder="Password" />
                                <div className="flex justify-evenly mt-6">
                                    {!isLoading ? <Button onClick={submitRegisterHandler} title="Register" toolTipTitle="Register" size="md" type="primary" /> : "Registering your brain..."}
                                </div>
                            </>
                        )}
                        {selectedSection === "Login" && (
                            <>
                                <div className="flex justify-end mb-5">
                                    <button onClick={toggle}>
                                        <Close imageProp="lg" />
                                    </button>
                                </div>
                                <Input onChange={(e) => {setUsername(e.target.value)}} value={username}  type="text" placeholder="Username" />
                                <br></br>
                                <Input onChange={(e) => {setPassword(e.target.value)}}  value={password}type="password" placeholder="Password" />
                                <div className="grid grid-cols-3 mt-2">
                                    <span onClick={() => toogletypes("Remember Me")} className={(selectedtypes.includes("Remember Me") ? "text-white bg-[#6042e0]" : "text-[#7c6fd1] bg-[#ebf4fe] ") + " rounded w-30 h-7 px-3 mr-3 mt-3 flex justify-center font-bold"}>{"Remember Me"}</span>
                                </div>
                                <div className="flex justify-evenly mt-6">
                                {!isLoading ? <Button onClick={submitLoginHandler} title="Login" toolTipTitle="Login" size="md" type="primary" /> : "Preparing your brain..."}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );

    function toggle(){
        props.setVisible(false);
        setSelectedSection("");
    }

    function toogletypes(element: string){
            if(selectedtypes.includes(element)){
                setSelectedtypes(selectedtypes.filter(tag => tag !== element))
            }else{
                setSelectedtypes([...selectedtypes, element])
            }
    }

    async function submitLoginHandler(){
        // eslint-disable-next-line prefer-const
        let result: Response;
        setIsLoading(true);

        setTimeout(() => {
            if(!result){
                alert("Request Timed Out: Please check your username or password & re-login")
                setIsLoading(false);
                setUsername("");
                setPassword("");
                setSelectedSection("");
            }
        }, 10000)

        result = await fetch(`${backendBaseURL}/api/v1/signin`, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                username: username,
                password: password,
                stayLoggedIn: selectedtypes
            })
        });

        console.log(result)
        const response  = await result.json();
        console.log(response)
        if(response.success === 1){
            localStorage.setItem('Authorization', response.Authorization);
            props.setVisible(false);
            setIsLoading(false);
            setLoginState(true);
            setUsername("");
            setPassword("");
            setSelectedSection("");
            navigate("/dashboard")
        } else {
            setIsLoading(false);
            setLoginState(false);
            alert(response.message);
            setUsername("");
            setPassword("");
        }
    }

    async function submitRegisterHandler(){
        setIsLoading(true)
        const result = await fetch(`${backendBaseURL}/api/v1/signup`, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const response  = await result.json();

        if(response.success === 1){
            alert(response.message)
            props.setVisible(false);
            setIsLoading(false);
            setUsername("");
            setPassword("");
            navigate("/dashboard")
            setSelectedSection("");
            navigate("/dashboard")
        }else{
            setIsLoading(false)
            alert(response.message)
            setIsLoading(false);
            setUsername("");
            setPassword("");
        }
    }
}


