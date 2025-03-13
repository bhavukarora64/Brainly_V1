import { useEffect } from "react";
import Document from "../assets/icons/Document";
import Twitter from "../assets/icons/Twitter";
import Video from "../assets/icons/Video";
import Link from "../assets/icons/Link";
import ShowAll from "../assets/icons/showAll"; 
import { useRecoilState } from "recoil";
import { cardDataAtom, cardDataAtomPersist } from "../assets/store/atoms/cardData";

interface SideBarItemProps {
    componentTypeIcon: "twitter" | "video" | "document" | "link" | "showAll";
    componentType: string;
    selectedOption: string; // ✅ Receive selected option from parent
    setSelectedOption: (type: string) => void; // ✅ Receive setter function from parent
}
// @ts-expect-error: TypeScript does not recognize the ReactElement type for the icons
const componentIcons: { [key: string]: ReactElement } = {
    twitter: <Twitter imageProp="lg" />,
    video: <Video imageProp="lg" />,
    document: <Document imageProp="lg" />,
    link: <Link imageProp="lg" />,
    showAll: <ShowAll imageProp="lg"/>
};

export default function SideBar_Item(props: SideBarItemProps) {
    const [cardData, setCardData] = useRecoilState(cardDataAtom);
    const [cardDataPersisted, setCardDataPersisted] = useRecoilState(cardDataAtomPersist);

    useEffect(() => {
        if(cardDataPersisted.length === 0){
            setCardDataPersisted(cardData);
        } 
    }, [cardData]);

    function handleFilter() {
        props.setSelectedOption(props.componentType);
        if (props.componentType === "Show All") {
            setCardData(cardDataPersisted);
        } else {
            // @ts-expect-error: TypeScript does not recognize the ReactElement type for the icons
            setCardData(cardDataPersisted.filter((card) => card.type === props.componentType));
        }
    }

    return (
        <button 
            onClick={handleFilter} 
            className={`${props.selectedOption === props.componentType ? "bg-gray-300" : ""} transition-all flex px-3 gap-7 py-3 w-80 text-[#484b56] cursor-pointer hover:bg-gray-200 hover:text-2xl`} 
        >
            {componentIcons[props.componentTypeIcon] || "❓"} {/* Fallback icon */}
            {props.componentType}
        </button>
    );
}
