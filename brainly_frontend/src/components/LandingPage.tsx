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
import CEO from "../assets/CEO.png"

function LandingPage(){

    const wordSwap:string[] = ["Organize","Streamline", "Categorize", "Structure"];
    const [isVisible, setIsVisible] = useState(false);
    const [isAboutVisible, setIsAboutVisible] = useState(false);
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
      setLoginVisible(true);
    } else {
      localStorage.removeItem("Authorization");
      setLoginState(false);
      window.location.reload();
    }
  }



  function AboutSection(){
    return(
      <div className="absolute left-[-110rem] w-screen h-screen flex top-[-11.5vh] justify-end  px-24 " onClick={() => (setIsAboutVisible((prevValue) => !prevValue))}>
      <div className=" flex flex-col items-center my-16 md:my-28 lg:my-36 xl:my-42 w-120 h-125 border-1 border-gray-200 shadow-xl rounded-bl-2xl rounded-tl-2xl rounded-br-2xl z-50 bg-white" onClick={() => (setIsAboutVisible(true))}>
        <h1 className="text-2xl font-bold m-3">Brainly v1.0 </h1>
        <h1>Your AI-Powered Second Brain</h1>
        <p className="font-extralight m-4"> 
          Welcome to Brainly v1.0, your all-in-one hub for capturing and organizing your digital world. Whether it’s 
          YouTube links, PDFs, tweets, or articles, Brainly lets you upload, sort, and retrieve content effortlessly 
          — powered by smart AI and a clean, intuitive dashboard.
          <br></br>
          Built for thinkers, creators, and lifelong learners, Brainly helps you stay organized, focused, and never forget what matters.
        </p>
        <div className="flex flex-col justify-between items-center w-full px-16">
        <h1 className="text-2xl font-bold m-3d">Meet Out Team</h1>
          <img src={CEO} className="rounded-[50%] w-32 flex-1"></img>
          <div className="flex-3 text-center">
            <p className="text-lg">Bhavuk Arora</p>
            <p className="text-xs text-gray-500">CEO & Co-Founder</p>
          </div>
        </div>
      </div>
      </div>
    )
  }

    return (
        <>
        <Authentication visible={loginVisible} setVisible={setLoginVisible} />
        <nav className="fixed w-full flex justify-between py-5 top-0 scroll-smooth z-40 bg-white scroll-m-10">
            <button className="ml-4 relative inline-flex text-center rounded-2xl" onClick={() => setIsVisible(prev => !prev)}>
                {isVisible ? <SolidList imageProp="xl" /> : <List imageProp="xl" />}
                <div className={`transition-all duration-500 flex flex-col rounded-bl-lg rounded-br-lg rounded-tr-lg border-2 border-gray-200 absolute left-10 top-8 mt-2 bg-white shadow-lg ${isVisible ? 'flex scale-100' : 'hidden scale-95'}`}>
                  <a href="#herosection"> <button className="px-6 py-2 w-72 text-2xl hover:bg-gray-300">Getting Started</button></a>
                  <Link to="/dashboard"><button className="px-4 py-2 w-72 text-2xl hover:bg-gray-300">Dashboard</button></Link>
                   <a href="#whybrainly" className="scroll-smooth"><button className="px-4 py-2 w-72 text-2xl hover:bg-gray-300">Why Brainly ?</button></a>
                   <a href="#featuresection" className="scroll-smooth"><button className="px-4 py-2 w-72 text-2xl hover:bg-gray-300">Features</button></a>
                   <a href="#subscriptionsection" className="scroll-smooth"><button className="px-4 py-2 w-72 text-2xl hover:bg-gray-300">Subscription</button></a>
                   <a href="#emailsection"><button className="px-4 py-2 w-72 text-2xl hover:bg-gray-300">Contact Us</button></a>
                </div>
            </button>
            <div className="flex">
                <div><Brain imageProp="xl" /></div>
                <h1 className="text-4xl font-bold">Brainly</h1>
            </div>
            <div className="flex gap-2 mr-4 relative">
                {isAboutVisible && <AboutSection />}
                <Button title="" toolTipTitle="About" onClick={() => setIsAboutVisible((prevValue) => !prevValue)} size="md" type="secondary" frontIcon={<About imageProp="lg" />}></Button>
                <Button title="" toolTipTitle="Login/Logout" onClick={loginOrlogout} size="md" type={loginState ? "logout" : "primary"} frontIcon={<LoginIcon imageProp="lg" />} />
            </div>
        </nav>
            
            <div id="herosection" className="text-center my-16 md:my-28 lg:my-36 xl:my-42 pt-24">
                <h1 className="transition-all text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mx-8 md:mx-20 lg:mx-56 xl:mx-64 md:leading-12 lg:leading-16 xl:leading-24">Never Forget Again. <span className="animate-pulse delay-100">{activeWord}</span> Your Digital Life with Brainly – Your AI-Powered Second Brain.</h1>
                <p className="text-1xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-light xl:leading-10 mx-12 sm:mx-16 md:mx-36 lg:mx-48 xl:mx-96 mt-10">Upload, organize, and retrieve YouTube links, documents, tweets, articles, and more – all in one intelligent dashboard</p>
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-10 my-12">
                    <Link to='/dashboard'><Button title="Get Started for Free" toolTipTitle="Get Started" size="md" type="primary" /></Link>
                    <Button title="Watch Demo Video" toolTipTitle="Watch Demo" size="md" type="primary" />
                </div>
            </div>
            <div  id="whybrainly" className="grid grid-cols-12 w-full text-center mb-32 h-auto px-16 xl:px-72 py-16 my-96 bg-gray-100 scroll-mt-56">
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

            <div id="featuresection" className="scroll-smooth text-center px-4 py-8 md:py-8 scroll-mt-32">
              <h1 className="text-2xl lg-text-3xl xl:text-5xl font-bold leading-12 xl:leading-24">Key features of your dashboard</h1>
              
              {/* Desktop version */}
              <div className="hidden sm:flex justify-center">
                <img src={dashboardbrainly} className="border border-black w-full max-w-7xl rounded shadow-md mt-16" alt="Brainly Dashboard Screenshot" />
              </div>
              
              {/* Mobile version - simplified or zoomed in on key features */}
              <div  className="flex flex-col sm:hidden">
                <p className="text-2xl lg-text-3xl xl:text-4xl font-bold leading-12 xl:leading-24">Key features of your dashboard:</p>
                <img src={dashboardMobile} className=" w-full rounded shadow-md mb-3" alt="Key Dashboard Features" />
              </div>
            </div>


            <div id="subscriptionsection" className="text-center mt-48 mb-36 xl:px-96 bg-gray-100">
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

            <div id="emailsection" className="scroll-mt-28 bg-white px-4 md:px-28 xl:px-64 py-20 text-center">
            <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-6">We’d love to hear from you!</h2>
            <p className="text-md md:text-xl font-light mb-10">Have questions, feedback, or ideas? Drop us a message below.</p>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = {
                  // @ts-expect-error: Error Expected
                  name: e.target.name.value,
                  // @ts-expect-error: Error Expected
                  email: e.target.email.value,
                  // @ts-expect-error: Error Expected
                  message: e.target.message.value
                };

                try {
                  const response = await fetch(`${backendBaseURL}/api/v1/send-email`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                  });

                  if (response.ok) {
                    alert("Thank you for your feedback!");
                    // @ts-expect-error: Error Expected
                    e.target.reset();
                  } else {
                    alert("Something went wrong. Please try again.");
                  }
                } catch (error) {
                  console.error("Feedback submission error:", error);
                  alert("Error sending feedback.");
                }
              }}
              className="space-y-6 w-full max-w-2xl mx-auto"
            >
              <input 
                name="name"
                type="text" 
                placeholder="Your Name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required 
              />
              <input 
                name="email"
                type="email" 
                placeholder="Your Email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required 
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required 
              ></textarea>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Send Feedback
              </button>
            </form>
          </div>



          <footer className="flex flex-col sm:flex-row sm:justify-center xl:justify-between px-6 items-center mt-24 mb-6">
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