import { useState } from "react";
import Brain from "../assets/icons/Brain";
import SideBar_Item from "./SideBar_Item";


export default function SideBar(){
    const [selectedOption, setSelectedOption] = useState<string>("Show All");
    return (
        <div className="h-screen ">
            <div className="flex items-center font-bold mb-5">
                <Brain imageProp="lg"/>
                <hr></hr>
                <h1 className="text-2xl">Brainly</h1>
            </div>
            <SideBar_Item componentType="Show All" componentTypeIcon="showAll" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item componentType="Twitter" componentTypeIcon="twitter" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item componentType="Youtube" componentTypeIcon="video" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item componentType="Document" componentTypeIcon="document" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item componentType="Link" componentTypeIcon="link" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        </div>
    )
}