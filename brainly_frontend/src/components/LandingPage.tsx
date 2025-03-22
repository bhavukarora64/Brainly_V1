import { useEffect, useState } from "react";
import About from "../assets/icons/About";
import Brain from "../assets/icons/Brain";
import List from "../assets/icons/OutlineList";
import SolidList from "../assets/icons/SolidList";
import LoginIcon from "../assets/icons/LoginIcon";
import Button from "./Button";
import Globe from "../assets/icons/Globe";
import Lightining from "../assets/icons/Lightining";
import dashboardbrainly from "../../src/brainly.png"
import dashboardMobile from "../brainly_mobile.png"
import Authentication from "./Authentication";
import { useRecoilState} from "recoil";
import { loginAtom } from "../assets/store/atoms/loggedIn";
import { Link } from "react-router-dom";

function LandingPage(){

    const wordSwap:string[] = ["Organize","Streamline", "Categorize", "Structure"];
    const [isVisible, setIsVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [loginState, setLoginState] = useRecoilState(loginAtom)
    const [activeWord, setActiveWord] = useState(wordSwap[0]);
    const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;
    

    useEffect(() => {
        setInterval(() => {
            setActiveWord(wordSwap[Math.floor(Math.random() *  wordSwap.length)])
        }, 2000)

    }, [])

  useEffect(() => {
      async function checkUserAndFetchData() {
        const loggedInUserData = await userCheck();
        if (loggedInUserData) {
          setLoginState(true);
        }
      }
      checkUserAndFetchData();
    }, []);

  async function userCheck() {
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        console.log("Please Re-login");
        return false;
      }

      const response = await fetch(`${backendBaseURL}/api/v1/me`, {
        method: "POST",
        headers: { "authorization": token }
      });

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  }

  function loginOrlogout() {
    if (!loginState) {
      console.log(loginState)
      setLoginVisible(true);
    } else {
      localStorage.removeItem("Authorization");
      setLoginState(false);
      window.location.reload();
    }
  }

    return (
        <>
        <Authentication visible={loginVisible} setVisible={setLoginVisible} />
        <nav className="flex justify-between py-5 sticky top-0 scroll-smooth z-40 bg-white scroll-m-10">
            <button className="ml-4 relative inline-flex text-center rounded-2xl" onClick={() => setIsVisible(prev => !prev)}>
                {isVisible ? <SolidList imageProp="xl" /> : <List imageProp="xl" />}
                <div className={`transition-all duration-500 flex flex-col rounded-lg absolute left-0 top-full mt-2 bg-white shadow-lg ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <button className="px-6 py-2 w-72 text-2xl hover:bg-gray-300">Getting Started</button>
                    <a href='/dashboard'><button className="px-4 py-2 text-2xl hover:bg-gray-300">Dashboard</button></a>
                    <button className="px-4 py-2 text-2xl hover:bg-gray-300">Recents</button>
                    <button className="px-4 py-2 text-2xl hover:bg-gray-300">Favourites</button>
                    <button className="px-4 py-2 text-2xl hover:bg-gray-300">Help & Support</button>
                    <button className="px-4 py-2 text-2xl hover:bg-gray-300">Email to Brainly</button>
                </div>
            </button>
            <div className="flex">
                <div><Brain imageProp="xl" /></div>
                <h1 className="text-4xl font-bold">Brainly</h1>
            </div>
            <div className="flex gap-2 mr-4">
                <Button title="" toolTipTitle="About" size="md" type="secondary" frontIcon={<About imageProp="lg" />} />
                <Button title="" toolTipTitle="Login/Logout" onClick={loginOrlogout} size="md" type={loginState ? "logout" : "primary"} frontIcon={<LoginIcon imageProp="lg" />} />
            </div>
        </nav>


            <div className="text-center my-16 md:my-28 lg:my-36 xl:my-42">
                <h1 className="transition-all text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mx-8 md:mx-20 lg:mx-56 xl:mx-64 md:leading-12 lg:leading-16 xl:leading-24">Never Forget Again. <span className="animate-pulse delay-100">{activeWord}</span> Your Digital Life with Brainly – Your AI-Powered Second Brain.</h1>
                <p className="text-1xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-light xl:leading-10 mx-12 sm:mx-16 md:mx-36 lg:mx-48 xl:mx-96 mt-10">Upload, organize, and retrieve YouTube links, documents, tweets, articles, and more – all in one intelligent dashboard</p>
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-10 my-12">
                    <Link to='/dashboard'><Button title="Get Started for Free" toolTipTitle="Get Started" size="md" type="primary" /></Link>
                    <Button title="Watch Demo Video" toolTipTitle="Watch Demo" size="md" type="primary" />
                </div>
            </div>


            <div className="grid grid-cols-12 w-full text-center mb-32 h-auto px-16 xl:px-72 py-10 bg-gray-100">
                <div className="col-span-12 xl:col-span-6 flex flex-col justify-center">
                    <h1 className="text-2xl md:3xl lg:4xl xl:text-5xl font-bold leading-8 md:leading-12 lg:leading-16 xl:leading-24 mb-2">Turn Chaos into Clarity</h1>
                    <p className="text-sm xl:text-xl font-light mx-16">Organize, Retrieve, and Elevate Your Ideas with Brainly’s Smart Features</p>
                </div>
                <div className="col-span-12 xl:col-span-2 text-center">
                    <div className="flex justify-center mt-10 mb-6">
                        <Globe imageProp="lg"/>
                    </div>
                    <p className="mx-16 md:mx-1">Save anything: YouTube videos, tweets, PDFs, articles, podcasts, and more.</p>
                </div>
                <div className="col-span-12 xl:col-span-2 text-center">
                <div className="flex justify-center mt-10 mb-6"><img src="https://cdn-icons-png.flaticon.com/512/9872/9872460.png" className="w-8 h-8"></img></div>
                    <p className="mx-12 md:mx-1">Access your second brain anywhere, on any device.</p>
                </div>
                <div className="col-span-12 xl:col-span-2 text-center">
                    <div className="flex justify-center mt-10 mb-6"><Lightining imageProp="lg"/></div>
                    <p className="mx-12 md:mx-1"> Find anything in seconds – even vague ideas or half-remembered quotes.</p>
                </div>
            </div>

            <div className="text-center px-4 py-8 md:py-12">
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-medium mb-6">Brainly Works For You</h1>
              
              {/* Desktop version */}
              <div className="hidden sm:flex justify-center">
                <img src={dashboardbrainly} className="border border-black w-full max-w-5xl rounded shadow-md" alt="Brainly Dashboard Screenshot" />
              </div>
              
              {/* Mobile version - simplified or zoomed in on key features */}
              <div className="flex flex-col sm:hidden">
                <p className="mb-4 text-sm text-gray-700">Key features of your dashboard:</p>
                <img src={dashboardMobile} className=" w-full rounded shadow-md mb-3" alt="Key Dashboard Features" />
              </div>
            </div>


            <div className="text-center mt-56 mb-36 xl:px-96 bg-gray-100">
                <div className="flex flex-col justify-center py-5">
                    <h1 className="text-2xl lg-text-3xl xl:text-4xl font-bold leading-12 xl:leading-24">Start Building Your Second Brain Today</h1>
                </div>
                <div className="md:flex justify-center gap-10 px-10">
                    <button className="transform-all duration-300 text-center border-2 border-black hover:h-76 hover:w-72 min-h-72 min-w-64 h-72 w-64 rounded-2xl bg-[#e1e7fe] hover:bg-white hover:shadow-2xl mb-10">
                        <div className="flex flex-col text-center mb-6">
                            <h1 className="text-1xl ">STANDARD</h1>
                            <h1 className="text-3xl text-[#5944e2]">€0/Month</h1>
                        </div>
                        <p className="font-light text-xl mx-2">Free storage and features for 7 days.</p>
                    </button>
                    <button className="transform-all duration-300 text-center border-2 border-black hover:h-76 hover:w-72 min-h-72 min-w-64 h-72 w-64 rounded-2xl bg-[#e1e7fe] hover:bg-white hover:shadow-2xl  mb-10">
                    <div className="flex flex-col text-center mb-6">
                            <h1 className="text-1xl">PRO</h1>
                            <h1 className="text-3xl text-[#5944e2]">€1.99/Month</h1>
                        </div>
                        <p className="font-light text-xl  mx-2">Unlimited storage, priority support.</p>
                    </button>
                    <button className="transform-all duration-300 text-center border-2 border-black hover:h-76 hover:w-72 min-h-72 min-w-64 h-72 w-64 rounded-2xl hover:shadow-2xl bg-[#e1e7fe] hover:bg-white  mb-10">
                    <div className="flex flex-col text-center mb-6">
                            <h1 className="text-1xl">ADVANCED</h1>
                            <h1 className="text-3xl text-[#5944e2]">€3.99/Month</h1>
                        </div>
                        <p className="font-light text-xl  mx-2 "> Unlimited storage, AI Features, priority support.</p>
                    </button>
                </div>
            </div>


            <footer className="flex flex-col sm:flex-row sm:justify-center xl:justify-between items-center my-5">
                <p className="flex text-lg font-mono gap-1 items-center">
                  <Brain imageProp="lg" />
                  Brainly
                </p>
                <p className="text-lg font-mono mt-2 sm:mt-0">Copyright 2025 Brainly. All rights reserved</p>
            </footer>
        </>



    )   
}

export default LandingPage;