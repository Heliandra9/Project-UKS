import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();
    const navBtn = "px-4 py-2 rounded-xl font-medium transition-all duration-300";
    const activeBtn = "bg-white text-green-600 font-semibold shadow-md scale-105";
    const normalBtn = "hover:text-green-200 hover:underline underline-offset-4";
    const logout = () => {
        localStorage.setItem("isLogin", "false");
        localStorage.removeItem("username");
        localStorage.removeItem("tipe_user");
        localStorage.removeItem("view");
        localStorage.setItem("showLogoutSuccess", "true");
        navigate("/");
    };

    return (
        <header className="shadow-lg sticky top-0 z-50 bg-green-500 text-white">
            <div className="mx-auto px-4 py-3 flex items-center">
                {/* Logo / Title */}
                <h1 className="text-lg md:text-xl font-bold tracking-wide">
                    UKS Sekolah
                </h1>

                <div className="ml-auto flex items-center gap-6">
                    {/* User + Dropdown */}
                    <div className="relative hidden md:block">
                        <div
                            onClick={() => setShowLogout(!showLogout)}
                            className="flex items-center gap-2 cursor-pointer hover:text-green-200 font-semibold"
                        >
                            {localStorage.getItem("username") || "User"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 transition-transform ${showLogout ? "rotate-180" : ""
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {showLogout && (
                            <div className="absolute top-10 right-0 w-40">
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:opacity-80 w-full p-2 rounded-md font-semibold flex items-center justify-center gap-2"
                                >
                                    <i className="bi bi-box-arrow-right"></i> Log Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                        >
                            {showMenu ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {showMenu && (
                <div className="md:hidden bg-green-600 px-4 pb-3 space-y-3">
                    
                    <button
                        onClick={() => {
                            logout();
                            setShowMenu(false);
                        }}
                        className="block w-full text-left bg-red-500 hover:opacity-80 rounded-md py-2 px-3 font-semibold"
                    >
                        <i className="bi bi-box-arrow-right"></i> Log Out
                    </button>
                </div>
            )}
        </header>
    );
}
