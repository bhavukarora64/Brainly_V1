import { useState } from "react";
import Brain from "../assets/icons/Brain";
import SideBar_Item from "./SideBar_Item";


export default function SideBar(){
    const [selectedOption, setSelectedOption] = useState<string>("Show All");
    return (
        <div className="h-screen">
            <div className="flex font-bold lg:mb-5 lg:mt-4 mx-4 my-4">
                <Brain imageProp="lg"/>
                <a href='/'><h1 className="text-2xl hidden sm:block mx-3">Brainly</h1></a>
            </div>
            <SideBar_Item toolTip="Show All" componentType="Show All" componentTypeIcon="showAll" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item toolTip="Twitter" componentType="Twitter" componentTypeIcon="twitter" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item toolTip="Youtube" componentType="Youtube" componentTypeIcon="video" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item toolTip="Document" componentType="Document" componentTypeIcon="document" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <SideBar_Item toolTip="Link" componentType="Link" componentTypeIcon="link" selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        </div>
    )
}