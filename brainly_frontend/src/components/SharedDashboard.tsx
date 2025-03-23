import ShareIcon from '../assets/icons/ShareIcon'
import Card from './Card'
import BinIcon from '../assets/icons/Bin'
import SideBar from './SideBar'
import Twitter from '../assets/icons/Twitter'
import Document from "../assets/icons/Document";
import Youtube from "../assets/icons/Video";
import Link from "../assets/icons/Link";
import { useRecoilState } from 'recoil'
import { cardDataAtom } from '../assets/store/atoms/cardData'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from './Button'
import Authentication from './Authentication'
import CreateContentModal from './CreateContentModal'
import ShowAll from '../assets/icons/showAll'
const backendWssURL = import.meta.env.VITE_BACKEND_BASE_WSS_URL;
const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const iconTypes = {
  "Twitter": <Twitter imageProp='md' />,
  "Youtube": <Youtube imageProp='md' />,
  "Link": <Link imageProp='md' />,
  "Document": <Document imageProp='md' />
}

function SharedDashboard() {
  
  const {sharableLink} = useParams();
  const [userData, setUserData] = useRecoilState(cardDataAtom)
  const [visible, setVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);

  async function fetchCardData(){
      const response = await fetch(`${backendBaseURL}/api/v1/brain/${sharableLink}`, {
        method: 'GET'
      }) 

      const output = await response.json();
      setUserData(output.content);
  }

  useEffect(() =>{
    fetchCardData()

    const ws = new WebSocket(`${backendWssURL}`);

    const jsonData = {
      "type": "join",
      "payload": {
          "roomId": sharableLink
      }
  }

    ws.onopen = () => {
      ws?.send(JSON.stringify(jsonData));
    }

    ws.onmessage = (event) => {
      console.log('EventData' + event.data)
      setUserData((JSON.parse(event.data)));
  }

  }, [])

  return (
    <div className='grid grid-cols-12'>
            <CreateContentModal visible={visible} setVisible={setVisible}/>
            <Authentication visible={loginVisible} setVisible={setLoginVisible} />
      <div className='col-span-2 border-[#e9ebed] border-r-2'>
        <SideBar />
      </div>
      <div className='col-span-10 bg-gray-50'>
        <div className='flex justify-between m-4'>
          <div>
            <h1 className='text-2xl font-bold'>{
              //@ts-expect-error: userData might be empty
              userData[0] ? userData[0].username : "Your Friend"
             }'s Brain</h1>
          </div>
                    <div className="flex gap-4">
                      <Button title="" toolTipTitle="Login/Register" size="md" type="primary" onClick={() => setLoginVisible(true)} frontIcon={<ShowAll imageProp="lg" />} style="hidden md:block"/>
                    </div>
        </div>
        <div className='flex m-10 gap-5 flex-wrap '>
            {userData.length ?
              userData.map((card) => (
                <Card
                // @ts-expect-error: contentId might be missing in card
                  key={card.contentId}
                  // @ts-expect-error: contentId might be missing in card
                  id={card.contentId}
                  // @ts-expect-error: title might be missing in card
                  title={card.title}
                  // @ts-expect-error: link might be missing in card
                  body={card.link.replace("watch?v=", "embed/")}
                  // @ts-expect-error: tags might be missing in card
                  tags={card.tags}
                  createdAt={new Date()}
                  // @ts-expect-error: type might be missing in card
                  contentType={card.type}
                  // @ts-expect-error: type might be missing in card
                  contentTypeIcon={iconTypes[card.type]}
                  firsticon={<BinIcon imageProp="lg" />}
                  secondicon={<ShareIcon imageProp="lg" />}
                /> 
            )):
            <h1 className='text-gray-400'>hmmmm....Seems like you have nothing in your mind right now !</h1>}
        </div>
      </div>
    </div>
  );
}

export default SharedDashboard;
