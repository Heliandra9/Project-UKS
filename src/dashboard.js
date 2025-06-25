import { useEffect, useState } from "react";
import { Button, SideBar } from "./component/Component";
import logo from "./component/Logo-UKS-Usaha-Kesehatan-Sekolah-Warna.png";
import Home from "./view/home";
import Profil from "./view/profil";
import Setting from "./view/setting";
import { useNavigate } from "react-router-dom";
import './App.css'

function Dashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState("home");
    const [nav , setNav] = useState(false);
    const [hober, setHober] = useState(true);

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
            <div onMouseEnter={toggleHober} onMouseLeave={toggleHober} className={`${nav && hober ?'w-16' :'w-1/6'} shadow-black shadow-lg transition-all duration-300 ease-in-out fixed top-0 left-0`}>
                <SideBar view={view} nav={nav} hober={hober} logo={logo} setView={setView} logot={logot}/>
            </div>
            <div className={`${nav ?'w-full ml-16' :'w-5/6 ml-58'} transition-all duration-300 ease-in-out h-full flex flex-col`}>
                <div className="w-full flex justify-between">
                    <div className="flex items-center">
                        <Button color="transparent items-center" onClick={toggleNav}>
                            <i className="bi bi-list text-xl"></i>
                        </Button>
                    </div>
                    <p className="text-lg font-bold bg-white shadow-black hover:shadow-md mb-4 rounded-2xl items-center transition-all duration-300 ease-in-out uppercase"><i className="bi bi-person-fill bg-yellow-500 rounded-full my-2 ml-2"></i> {localStorage.getItem("username")}&nbsp;&nbsp;</p>
                </div>
                <div className="w-full h-full bg-white rounded-lg p-4 shadow-lg">
                    {view === "home"  ? <Home /> :view === "profil" ? <Profil/> :view === "setting" && <Setting/>}
                </div>
            </div>
        </div>
    )
}
export default Dashboard;