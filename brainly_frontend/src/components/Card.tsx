interface cardProps{
    "title": string,
    "body": string,
    "tags": string,
    "createdAt": Date, 
    "contentType": string,
    "contentTypeIcon": ReactElement,
    "firsticon": ReactElement,
    "secondicon": ReactElement,
    "id": string
}

import { ReactElement } from "react";
import { useRecoilState } from "recoil";
import { cardDataAtom } from "../assets/store/atoms/cardData";
const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Card(props: cardProps){  
    const [cardData, setCardData] = useRecoilState(cardDataAtom);

    return (
        <div id={props.id} className="h-auto min-h-100 w-85 p-4 border-[#edeff0] rounded-lg shadow-sm bg-white">
            <div className="flex justify-between">
                <div className="flex gap-5 font-medium">
                    {props.contentTypeIcon}
                    <h1>{props.title}</h1>
                </div>
                <div className="flex gap-5">
                <button onClick={() => deletePost(props.id)} className='cursor-pointer'>{props.firsticon}</button>
                <button onClick={() => sharePost(props.id)} className='cursor-pointer'>{props.secondicon}</button>
                </div>
            </div>
            <div className="mt-4">         
            {props.contentType === "Youtube" && <iframe 
                src={props.body}
                title="YouTube video player" 
                style={{ border: 0 }} 
                allow="accelerometer; 
                autoplay; 
                clipboard-write; 
                encrypted-media; 
                gyroscope; 
                picture-in-picture; 
                web-share" allowFullScreen 
                className="w-auto h-auto">     
            </iframe>}
            {props.contentType === "Twitter" && (<blockquote className="twitter-tweet">
                <a href={props.body}></a> 
            </blockquote>)}
            {props.contentType === "Link" && (props.body)}
            {props.contentType === "Document" && (props.body)}
            </div>
            <div className="flex mt-3 flex-wrap">
                {props.tags.split(',').map((element: string, index: number) => (
                    <p key={index} className="text-[#7c6fd1] bg-[#ebf4fe] rounded-xl w-auto px-3 mr-3 mt-3">{"#" + element}</p>
                ))}
            </div>
            <div className="mt-3 text-[#95959d]">
                Added on {props.createdAt.toDateString()}
            </div>
        </div>
    )

    async function deletePost(propId: string) {
        const token = localStorage.getItem("Authorization");
        
        if (!token) {
            console.log("Please Re-login");
            return false;
          }

        try {
            const response = await fetch(`${backendBaseURL}/api/v1/content/${propId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error deleting post:", errorData.message);
                alert(errorData.message);
                return;
            }
    
            const result = await response.json();
            alert(result.message);
            
            setCardData(cardData.filter((card: { contentId: string }) => card.contentId != propId))
    
        } catch (error) {
            console.error("Network error:", error);
            alert("Failed to delete post. Please try again.");
        }
    }

    async function sharePost(propId: string){
        const link = cardData.filter((element) => element.contentId == propId)
        await navigator.clipboard.writeText(link[0].link);
        alert(`Copied the link to the clipboard: ${link[0].link}` )
    }
    
    
}