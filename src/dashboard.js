import { useEffect, useState } from "react";
import { Button, SideBar } from "./component/Component";
import logo from "./component/Logo-UKS-Usaha-Kesehatan-Sekolah-Warna.png";
import Home from "./view/home";
import Siswa from "./view/data_siswa";
import Setting from "./view/setting";
import { useNavigate } from "react-router-dom";
import './App.css'

function Dashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState("home");
    const [nav , setNav] = useState(false);
    const [hober, setHober] = useState(true);
    const [modal, setModal] = useState(false);

    const funcModal = () => {
        setModal(!modal);
    }

    const toggleNav = () => {
        setNav(!nav);
    }
    const toggleHober = () => {
        setHober(!hober);
    }
    useEffect(() => {
        if (localStorage.getItem("isLogin") !== "true") {
            window.location.href = "/";
        }
    }, []);
    const logot = () => {
        localStorage.setItem("isLogin", "false");
        localStorage.removeItem("username");
        navigate("/");
    }
    return(
        <div className="w-full h-full flex px-4 py-2 justify-center items-center bg-gray-300">
            <div onMouseEnter={toggleHober} onMouseLeave={toggleHober} className={`${nav && hober ?'sm:w-16 w-full' :'sm:w-1/6 w-full'} z-100 sm:h-screen shadow-black shadow-lg transition-all duration-300 ease-in-out absolute sm:fixed top-0 left-0`}>
                <SideBar className={`md:relative`} view={view} nav={nav} hober={hober} logo={logo} setView={setView} logot={logot}/>
            </div>
            <div className={`${nav ?'w-full ml-16' :'w-5/6 lg:ml-58 md:ml-40 sm:ml-30'} mt-58 sm:mt-0 transition-all duration-300 ease-in-out h-full flex flex-col`}>
                <div className="w-full flex justify-between">
                    <div className="flex items-center">
                        <Button color="transparent items-center sm:block hidden" onClick={toggleNav}>
                            <i className="bi bi-list text-xl"></i>
                        </Button>
                    </div>
                    <div className={`absolute top-50 sm:top-4 transition-all duration-300 ease-in-out z-50 shadow-black right-4 ${modal ?' mb-4 bg-white rounded-2xl p-2 shadow-md' :''} flex flex-col`}>
                        <p onClick={funcModal} className={`text-lg font-bold bg-white shadow-black ${modal ?'' :`hover:shadow-md`} mb-4 rounded-2xl items-center transition-all duration-300 ease-in-out uppercase`}><i className="bi bi-person-fill bg-yellow-500 rounded-full my-2 ml-2"></i> {localStorage.getItem("username")}&nbsp;&nbsp;</p>
                        <Button color={`red-500 ${modal ?''  :'hidden'} bottom-0`} textColor="white" onClick={logot}>
                            <i className="bi bi-box-arrow-right"></i> Log Out
                        </Button>
                    </div>
                    
                </div>
                <div className="w-full h-full bg-white rounded-lg p-4 shadow-lg">
                    {view === "home"  ? <Home /> :view === "siswa" ? <Siswa/> :view === "setting" && <Setting/>}
                </div>
            </div>
        </div>
    )
}
export default Dashboard;