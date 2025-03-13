import Close from "../assets/icons/Close";
import Button from "./Button";
import Input from "./Input";
import { Dispatch, SetStateAction, useState } from 'react';
import { loginAtom } from "../assets/store/atoms/loggedIn";
import { useSetRecoilState } from "recoil";
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
    const setLoggedIn = useSetRecoilState(loginAtom);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <>
            {props.visible && (
                <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-96">
                        {selectedSection === "" && (
                                <>
                                    <div className="flex justify-end">
                                        <button onClick={toggle}>
                                            <Close imageProp="lg" />
                                        </button>
                                    </div>
                                    <div className="flex justify-evenly m-15">
                                        <Button onClick={() => setSelectedSection("Register")} title="Register" size="lg" type="primary" />
                                    </div>
                                    <div className="flex justify-evenly m-15">
                                        <Button onClick={() => setSelectedSection("Login")} title="Login" size="lg" type="primary" />
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
                                    {isLoading ? <Button onClick={submitRegisterHandler} title="Register" size="md" type="primary" /> : "Registering your brain..."}
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
                                    <span onClick={() => toogletypes("Remeber Me")} className={(selectedtypes.includes("Remeber Me") ? "text-white bg-[#6042e0]" : "text-[#7c6fd1] bg-[#ebf4fe] ") + " rounded w-30 h-7 px-3 mr-3 mt-3 flex justify-center font-bold"}>{"Remeber Me"}</span>
                                </div>
                                <div className="flex justify-evenly mt-6">
                                {isLoading ? <Button onClick={submitLoginHandler} title="Login" size="md" type="primary" /> : "Preparing your brain..."}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );

    function toggle(){
        // @ts-expect-error: setVisible does not accept any arguments
        props.setVisible();
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
        setIsLoading(false)
        const result = await fetch(`${backendBaseURL}/api/v1/signin`, {
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

        const response  = await result.json();

        if(response.success === 1){
            localStorage.setItem('Authorization', response.Authorization);
            setLoggedIn(true)
            alert(response.message)
            window.location.href = '/.dashboard';

        }else{
            setIsLoading(true)
            alert(response.message)
        }
    }

    async function submitRegisterHandler(){
        setIsLoading(false)
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
            window.location.href = './dashboard';

        }else{
            setIsLoading(true)
            alert(response.message)
        }
    }
}


