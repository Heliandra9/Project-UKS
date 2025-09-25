import logo from "./component(admin)/Logo-UKS-Usaha-Kesehatan-Sekolah-Warna.png";
import { useState, useEffect, useMemo } from "react";
import { FormField, Button } from "./component(admin)/Component";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./App.css";

const BASE_URL = "http://localhost/pkl/Project-UKS/backend";

export default function App() {
  const navigate = useNavigate();

  // ==== form state ====
  const [pwVisible, setPwVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [remember, setRemember] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverMsg, setServerMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.trim().length > 0 && !loading,
    [username, password, loading]
  );

  const togglePw = () => setPwVisible((s) => !s);

  const handleCaps = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      setServerMsg("");

      // Abort jika > 12 detik
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`${BASE_URL}/proses/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `username=${encodeURIComponent(username)}` +
          `&password=${encodeURIComponent(password)}`,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Antisipasi response non-JSON
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Respons server tidak valid.");
      }

      if (data.status === "sukses") {
        // session storage untuk non-remember
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem("isLogin", "true");
        storage.setItem("username", data.username);
        storage.setItem("tipe_user", data.tipe_user);
        storage.setItem("showLoginSuccess", "true");

        const role = (data.tipe_user || "").toLowerCase();
        if (role === "admin") navigate("/admin");
        else if (role === "operator") navigate("/operator");
        else if (role === "gudang") navigate("/gudang");
        else navigate("/");
      } else {
        const msg = data.message || "Username atau password salah";
        setServerMsg(msg);
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: msg,
          showConfirmButton: true,
        });
      }
    } catch (err) {
      const msg =
        err.name === "AbortError"
          ? "Permintaan timeout. Coba lagi."
          : (err?.message || "Terjadi masalah koneksi ke server");
      setServerMsg(msg);
      Swal.fire({
        icon: "error",
        title: "Gagal Terhubung",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // redirect jika sudah login (localStorage atau sessionStorage)
  useEffect(() => {
    const get = (k) => localStorage.getItem(k) ?? sessionStorage.getItem(k);
    const isLogin = get("isLogin") === "true";
    const tipe = get("tipe_user");

    if (isLogin) {
      if (tipe === "admin") navigate("/admin");
      else if (tipe === "operator") navigate("/operator");
      else if (tipe === "gudang") navigate("/gudang");
    }
  }, [navigate]);

  // toast setelah logout
  useEffect(() => {
    if (localStorage.getItem("showLogoutSuccess") === "true") {
      Swal.fire({
        icon: "success",
        title: "Logout Berhasil",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        localStorage.removeItem("showLogoutSuccess");
      });
    }
  }, []);

  // bersihkan pesan server saat user mengetik ulang
  useEffect(() => {
    if (serverMsg) setServerMsg("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-emerald-50 grid place-items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-white/90 backdrop-blur border border-emerald-100 shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Logo UKS"
            className="h-24 w-24 object-contain mb-3 drop-shadow-sm"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-emerald-800">
            UKS
          </h1>
          <p className="text-sm text-emerald-700 font-medium -mt-1">
            SMK Negeri 2 Tasikmalaya
          </p>
        </div>

        {/* Fields */}
        <div className="mt-8 grid gap-4">
          <FormField
            label="Username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            rightIcon={<i className="bi bi-person-fill" />}
            error={serverMsg.includes("Username") ? serverMsg : ""}
          />

          <FormField
            label="Password"
            name="password"
            type={pwVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            helpText={capsLockOn ? "Caps Lock aktif" : ""}
            rightIcon={
              <button
                type="button"
                onClick={togglePw}
                className="text-gray-500 hover:text-gray-700"
                aria-label={pwVisible ? "Sembunyikan password" : "Tampilkan password"}
                aria-pressed={pwVisible}
              >
                <i className={`bi ${pwVisible ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
            }
            error={serverMsg.includes("password") ? serverMsg : ""}
          />


          {/* Remember me + error */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-emerald-900/80">
              <input
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ingat saya
            </label>

            <a
              className="text-sm text-emerald-700 hover:underline"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Lupa password?
            </a>
          </div>

          {serverMsg && (
            <div
              role="alert"
              className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md p-2"
            >
              {serverMsg}
            </div>
          )}

          <Button type="submit" className="w-full d-flex justify-center" disabled={!canSubmit}>
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin" /> &nbsp;Memproses…
              </>
            ) : (
              "LOGIN"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
