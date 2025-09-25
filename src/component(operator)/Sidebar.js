import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUserPlus, FiActivity, FiLogOut } from "react-icons/fi";

/** Props:
 * - view: "tambah" | "kunjungan" | ...
 * - setView: (v) => void
 */
export default function Sidebar({ view, setView }) {
  const [showLogout, setShowLogout] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const navigate = useNavigate();

  const navBtn =
    "w-full text-left px-3 py-2 rounded-xl font-medium transition-colors";
  const activeBtn =
    "bg-green-100 text-green-800";
  const normalBtn =
    "hover:bg-neutral-100 text-neutral-700";

  const logout = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };

  const Username = () => (
    <div
      onClick={() => setShowLogout((s) => !s)}
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 cursor-pointer select-none"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/70 text-green-700 flex items-center justify-center font-bold">
          {(localStorage.getItem("username") || "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="font-semibold text-neutral-800 leading-tight">
          {localStorage.getItem("username") || "User"}
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 text-neutral-500 transition-transform ${showLogout ? "rotate-180" : ""}`}
        viewBox="0 0 24 24" fill="currentColor"
      >
        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd"/>
      </svg>
    </div>
  );

  const Nav = ({ onClick }) => (
    <nav className="space-y-1">
      <button
        onClick={() => { setView("tambah"); onClick?.(); }}
        className={`${navBtn} ${view === "tambah" ? activeBtn : normalBtn}`}
      >
        <span className="inline-flex items-center gap-2">
          <FiUserPlus size={18} className="text-green-600" />
          Tambah Pasien
        </span>
      </button>
      <button
        onClick={() => { setView("kunjungan"); onClick?.(); }}
        className={`${navBtn} ${view === "kunjungan" ? activeBtn : normalBtn}`}
      >
        <span className="inline-flex items-center gap-2">
          <FiActivity size={18} className="text-green-600" />
          Kunjungan
        </span>
      </button>
    </nav>
  );

  return (
    <>
      {/* === Sidebar Desktop (fixed) === */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral-200 shadow-[0_4px_20px_rgba(2,6,23,.06)]">
        <div className="flex-1 flex flex-col">
          {/* Brand */}
          <div className="h-16 px-6 border-b border-neutral-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7E5F] to-[#FD3A69]" />
            <div className="font-bold text-neutral-800">UKS Sekolah</div>
          </div>

          {/* Nav */}
          <div className="p-3 overflow-y-auto h-[calc(100vh-8rem)]">
            <div className="px-3 text-xs uppercase text-neutral-500 mb-2">Menu</div>
            <Nav />
          </div>

          {/* User + Logout */}
          <div className="border-t border-neutral-200 p-3 relative">
            <Username />
            {showLogout && (
              <div className="absolute bottom-16 left-3 right-3">
                <button
                  onClick={logout}
                  className="bg-red-500 hover:opacity-90 w-full p-2 rounded-md font-semibold text-white flex items-center justify-center gap-2"
                >
                  <FiLogOut size={18} className="mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* === Topbar kecil untuk Mobile (trigger drawer) === */}
      <header className="md:hidden sticky top-0 z-50 bg-green-500 text-white shadow-lg">
        <div className="px-4 py-3 flex items-center">
          <button
            className="p-2 rounded-lg bg-green-600/30"
            onClick={() => setOpenMobile(true)}
            aria-label="Buka menu"
          >
            {/* hamburger */}
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
          <h1 className="ml-3 text-lg font-bold tracking-wide">UKS Sekolah</h1>
        </div>
      </header>

      {/* === Drawer Mobile === */}
      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenMobile(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white border-r border-neutral-200 shadow-xl flex flex-col">
            <div className="h-16 px-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="font-bold">UKS Sekolah</div>
              <button
                className="p-2 rounded-lg border border-neutral-200"
                onClick={() => setOpenMobile(false)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            <div className="p-3 overflow-y-auto">
              <div className="px-3 text-xs uppercase text-neutral-500 mb-2">Menu</div>
              <Nav onClick={() => setOpenMobile(false)} />
              <div className="mt-4 border-t pt-3">
                <button
                  onClick={() => { logout(); setOpenMobile(false); }}
                  className="w-full text-left bg-red-500 hover:opacity-90 rounded-md py-2 px-3 font-semibold text-white flex items-center gap-2"
                >
                  <FiLogOut size={18} className="mr-2" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
