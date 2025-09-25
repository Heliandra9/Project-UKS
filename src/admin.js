import { useEffect, useState } from "react";
import { Button, Sidebar } from "./component(admin)/Component";
import logo from "./component(admin)/Logo-UKS-Usaha-Kesehatan-Sekolah-Warna.png";
import Home from "./component(admin)/view/home";
import Siswa from "./component(admin)/view/data_siswa";
import Obat from "./component(admin)/view/data_obat";
import User from "./component(admin)/view/data_user";
import Kunjungan from "./component(admin)/view/daftar_kunjungan";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./App.css";

function Admin() {
  const navigate = useNavigate();

  // ==== UI state ====
  const [search, setSearch] = useState("");
  const [view, setView] = useState(localStorage.getItem("view") || "home");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // modal insert (diteruskan ke child)
  const [modalName, setModalName] = useState("");
  const [modalInsert, setModalInsert] = useState(false);
  const [data, setData] = useState({});

  const userType = localStorage.getItem("tipe_user");
  const username = localStorage.getItem("username") || "User";

  // Persist view
  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  // Auth guard + role guard + toast login
  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate("/");
      return;
    }

    if (localStorage.getItem("showLoginSuccess") === "true") {
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang ${username}`,
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        localStorage.removeItem("showLoginSuccess");
      });
    }

    switch (userType) {
      case "admin":
        break;
      case "operator":
        navigate("/operator");
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Halaman ini hanya untuk admin.",
        });
        break;
      default:
        navigate("/");
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Anda tidak memiliki akses ke halaman ini.",
        });
    }
  }, [navigate, userType, username]);

  // UI actions
  const funcModalInsert = () => {
    setModalName("insert");
    setData({});
    setModalInsert(true);
  };

  const logot = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };

  // ==== Layout ====
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fixed (desktop) */}
      <Sidebar
        className="hidden md:flex"
        setView={(v) => {
          setView(v);
          setMobileNavOpen(false);
        }}
        view={view}
        logo={logo}
      />

      {/* Sidebar overlay (mobile) */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-64 bg-white md:hidden shadow-xl">
            <Sidebar
              className="!flex !h-full"
              setView={(v) => {
                setView(v);
                setMobileNavOpen(false);
              }}
              view={view}
              logo={logo}
            />
          </div>
        </>
      )}

      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-2 px-4 py-3 md:pl-64">
          {/* Mobile menu button */}
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setMobileNavOpen((s) => !s)}
          >
            <i className="bi bi-list text-lg" /> Menu
          </Button>

          {/* Search & CTA */}
          <div className="ml-auto flex w-full max-w-3xl items-center gap-2">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-10 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-[#FD3A69] focus:outline-none focus:ring-[#FD3A69]"
                placeholder={
                  view === "kunjungan" ? "Cari kunjungan…" : `Cari data ${view}…`
                }
              />
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {(view === "siswa" ||
              view === "obat" ||
              view === "user" ||
              view === "kunjungan") && (
              <>
                {view === "kunjungan" && (
                  <input
                    type="date"
                    onChange={(e) => setSearch(e.target.value)}
                    className="hidden sm:block w-48 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#FD3A69] focus:outline-none"
                  />
                )}
                <Button onClick={funcModalInsert} className="whitespace-nowrap">
                  + Tambah data
                </Button>
              </>
            )}

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((s) => !s)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
              >
                <i className="bi bi-person-fill bg-yellow-500 text-white rounded-full p-1" />
                <span className="hidden sm:inline font-semibold">{username}</span>
                <i className="bi bi-chevron-down text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <Button
                    variant="danger"
                    className="w-full justify-center"
                    onClick={logot}
                  >
                    <i className="bi bi-box-arrow-right" /> Log Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-10 pt-4 pl-4 sm:pl-68">
        <div className="w-full rounded-2xl bg-white p-4 shadow-sm">
          {view === "home" ? (
            <Home />
          ) : view === "siswa" ? (
            <Siswa
              modalName={modalName}
              setModalName={setModalName}
              modal={modalInsert}
              setModal={setModalInsert}
              data={data}
              setData={setData}
              cari={search}
              view={view}
            />
          ) : view === "obat" ? (
            <Obat
              modalName={modalName}
              setModalName={setModalName}
              modal={modalInsert}
              setModal={setModalInsert}
              data={data}
              setData={setData}
              cari={search}
              view={view}
            />
          ) : view === "user" ? (
            <User
              modalName={modalName}
              setModalName={setModalName}
              modal={modalInsert}
              setModal={setModalInsert}
              data={data}
              setData={setData}
              cari={search}
              view={view}
            />
          ) : (
            view === "kunjungan" && (
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
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
