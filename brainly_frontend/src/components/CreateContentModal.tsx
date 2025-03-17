import Close from "../assets/icons/Close";
import { cardDataAtom } from "../assets/store/atoms/cardData";
import Button from "./Button";
import Input from "./Input";
import { Dispatch, SetStateAction, useState } from 'react';
import { useRecoilState } from 'recoil';
const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

interface ModalProps {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    fetchData: () => string
}

const types:string[] = ["Twitter", "Youtube", "Link","Document"]

export default function CreateContentModal(props: ModalProps) {

    const [selectedtypes, setSelectedtypes] = useState<string[]>([]);
    const [title, setTitle] = useState<string>('');
    const [link, setLink ] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useRecoilState(cardDataAtom)

    return (
        <>
            {props.visible && (
                <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-96">
                        <div className="flex justify-end mb-5">
                            <button onClick={toggle}>
                                <Close imageProp="lg" />
                            </button>
                        </div>
                        <Input onChange={(e) => {setTitle(e.target.value)}} value={title}  type="text" placeholder="Title" />
                        <br></br>
                        <Input onChange={(e) => {setLink(e.target.value)}}  value={link}type="text" placeholder="Link" />
                        <br></br>
                        <Input onChange={(e) => {setTags(e.target.value)}}  value={tags}type="text" placeholder="Tags " />
                        <div className="grid grid-cols-3 mt-2">
                            {types.map((element: string, index: number) => (
                                <span onClick={() => toogletypes(element)} key={index} className={(selectedtypes.includes(element) ? "text-white bg-[#6042e0]" : "text-[#7c6fd1] bg-[#ebf4fe] ") + " rounded w-auto h-7 px-3 mr-3 mt-3 flex justify-center font-bold"}>{element}</span>
                            ))}
                        </div>
                        <div className="flex justify-evenly mt-6">

                        {!isLoading ? <Button onClick={submitHandler} title="Submit" size="md" type="primary" /> : "Training your Brain...might take few seconds.."}
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    function toggle(){

        props.setVisible(false);
    }

    function toogletypes(element: string){
        if(selectedtypes.length > 0 && !selectedtypes.includes(element)){
            alert("Remove the selection to select a new type.")
        }else{
            if(selectedtypes.includes(element)){
                setSelectedtypes(selectedtypes.filter(tag => tag !== element))
            }else{
                setSelectedtypes([...selectedtypes, element])
            }
        }
    }

    async function submitHandler(){
        setIsLoading(true);
        const token  = localStorage.getItem("Authorization")
        const response = await fetch(`${backendBaseURL}/api/v1/content`, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                "authorization": token || ''
            }),
            body: JSON.stringify({
                title: title,
                link: link,
                tags: tags,
                type: selectedtypes
            })
        });
        const userData = await response.json(); 
        console.log(userData.message)
        setIsLoading(false);
        alert(userData.message)
        props.setVisible(false);
        setUserData(props.fetchData());
        // window.location.reload();
    }

}


