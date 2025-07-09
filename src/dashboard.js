import { useEffect, useState } from "react";
import { Button, SideBar } from "./component/Component";
import logo from "./component/Logo-UKS-Usaha-Kesehatan-Sekolah-Warna.png";
import Home from "./view/home";
import Siswa from "./view/data_siswa";
import Obat from "./view/data_obat";
import { useNavigate } from "react-router-dom";
import './App.css'
import Swal from 'sweetalert2';
import Kunjungan from "./view/daftar_kunjungan";

function Dashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [nav, setNav] = useState(false);
    const [hober, setHober] = useState(true);
    const [modal, setModal] = useState(false);
    const [view, setView] = useState(localStorage.getItem("view") || "home");
    useEffect(() => {
        localStorage.setItem("view", view);
    }, [view]);
    const funcSearch = (e) => {
        setSearch(e.target.value);
    }
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
        localStorage.removeItem("tipe_user");
        localStorage.removeItem("view");
        localStorage.setItem("showLogoutSuccess", "true");
        navigate("/");
    }
    const [modalName, setModalName] = useState("");
    const [modalInsert, setModalInsert] = useState(false);
    const [data, setData] = useState({});

    const funcModalInsert = () => {
        setModalName("insert");
        setData({});
        setModalInsert(true);
    };

    useEffect(() => {
        if (localStorage.getItem("showLoginSuccess") === "true") {
            Swal.fire({
                icon: 'success',
                title: 'Login Berhasil!',
                text: 'Selamat datang!',
                timer: 1500,
                showConfirmButton: false
            });
            localStorage.removeItem("showLoginSuccess");
        }
    }, []);

    return (
        <div className="w-full h-full flex px-4 py-2 justify-center items-center bg-gray-300">
            <div
                onMouseEnter={() => setHober(!hober)}
                onMouseLeave={() => setHober(!hober)}
                className={`${nav && hober ? 'sm:w-16 w-full' : 'sm:w-1/6 w-full'} z-100 sm:h-screen shadow-black shadow-lg transition-all duration-300 ease-in-out absolute sm:fixed top-0 left-0`}
            >
                <SideBar
                    className={`md:relative`}
                    setView={setView}
                    view={view}
                    nav={nav}
                    hober={hober}
                    logo={logo}
                    logot={logot}
                />
            </div>
            <div className={`${nav ? 'w-full ml-16' : 'w-5/6 lg:ml-58 md:ml-40 sm:ml-30'} mt-58 sm:mt-0 transition-all duration-300 ease-in-out h-full flex flex-col`}>
                <div className="w-full flex mb-2 items-center">
                    <div className="flex">
                        <Button color="white items-center sm:block hidden" onClick={toggleNav}>
                            <i className="bi bi-list"></i>
                        </Button>
                    </div>
                    {view === "home" ?
                        <h1 className="text-2xl font-bold ml-4 text-gray-700">Beranda</h1> :
                        (view === "siswa" || view === "obat") ? (
                            <div className={`flex ml-6 w-full mr-40`}>
                                <input onKeyUp={funcSearch} placeholder={`Cari data ${view === "siswa" ? "siswa" : view === "obat" && "obat"}`} className={`bg-white w-full shadow-md focus:outline-0 px-2 rounded-sm`} />
                                <Button onClick={funcModalInsert} width="w-1/6 ml-8" color="blue-500" sizeTxT="text-sm" textColor="white">+&nbsp;Tambah&nbsp;data</Button>
                            </div>
                        ): view === "kunjungan" && (
                            <div className={`flex ml-6 w-full mr-40`}>
                                <input onKeyUp={funcSearch} placeholder={`Cari daftar kunjungan`} className={`bg-white w-full shadow-md focus:outline-0 px-2 rounded-sm`} />
                                <input type="date" onChange={funcSearch} placeholder={`Cari daftar kunjungan`} className={`ml-8 bg-white w-1/6 shadow-md focus:outline-0 px-2 rounded-sm`} />
                                <Button onClick={funcModalInsert} width="w-1/6 ml-8" color="blue-500" sizeTxT="text-sm" textColor="white">+&nbsp;Tambah&nbsp;data</Button>
                            </div>
                        )
                    }
                    <div className={`absolute top-61 sm:top-4 transition-all duration-300 ease-in-out z-50 shadow-black right-4 ${modal ? ' mb-4 bg-white rounded-2xl p-2 shadow-md' : ''} flex flex-col`}>
                        <p onClick={funcModal} className={`text-lg font-bold bg-white shadow-black ${modal ? '' : `hover:shadow-md`} mb-4 rounded-sm items-center transition-all duration-300 ease-in-out uppercase`}><i className="bi bi-person-fill bg-yellow-500 rounded-full my-2 ml-2"></i> {localStorage.getItem("username")}&nbsp;&nbsp;</p>
                        <Button color={`red-500 ${modal ? '' : 'hidden'} bottom-0`} textColor="white" onClick={logot}>
                            <i className="bi bi-box-arrow-right"></i> Log Out
                        </Button>
                    </div>

                </div>
                <div className="w-full h-full bg-white rounded-lg p-4 shadow-lg">
                    {view === "home" ? <Home /> :
                        view === "siswa" ? <Siswa
                            modalName={modalName}
                            setModalName={setModalName}
                            modal={modalInsert}
                            setModal={setModalInsert}
                            data={data}
                            setData={setData}
                            cari={search}
                            view={view}
                        /> :
                            view === "obat" ?
                            <Obat
                                modalName={modalName}
                                setModalName={setModalName}
                                modal={modalInsert}
                                setModal={setModalInsert}
                                data={data}
                                setData={setData}
                                cari={search}
                                view={view}
                            /> : view === "kunjungan" && 
                            <Kunjungan
                                modalName={modalName}
                                setModalName={setModalName}
                                modal={modalInsert}
                                setModal={setModalInsert}
                                data={data}
                                setData={setData}
                                cari={search}
                                view={view}
                            />
                            }
                </div>
            </div>
        </div>
    )
}
export default Dashboard;