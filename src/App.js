import logo from "./component/Logo-UKS-Usaha-Kesehatan-Sekolah-Warna.png";
import { useState, useEffect } from "react";
import { FormFloating, Button } from "./component/Component";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [pw, setPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const tooglepw = () => setPw(!pw);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/login-uks/backend/proses/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      });
      const data = await response.json();
      if (data.status === "sukses") {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", data.username);
        navigate("/dashboard");
      } else {
        setData(data.message);
      }
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLogin") === "true") {
      navigate("/dashboard");
    }
  },[navigate]);
  return (
    <form onSubmit={handleSubmit} className="w-full h-screen flex justify-center items-center bg-gray-300">
      <div className={`bg-white lg:w-1/2 sm:w-full rounded-2xl p-8 flex flex-col`}>
        <div className={`flex flex-col`}>
          <div className={`flex justify-center`}>
            <img src={logo} alt="Logo" className={`lg:size-40 size-35`} />
          </div>
          <div className={`flex flex-col`}>
            <h1 className={`lg:text-2xl sm:text-md text-green-600 font-bold text-center`}>
              UKS
            </h1>
            <h1 className={`lg:text-2xl sm:text-md text-green-600 font-bold text-center`}>
              SMK Negeri 2 Tasikmalaya
            </h1>
          </div>
        </div>
        <div className={`flex flex-col px-4 mt-12`}>
          <FormFloating
            pw={pw}
            tooglepw={tooglepw}
            icon="bi bi-person-fill"
            type="text"
            name="username"
            text="Username"
            data={data}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <FormFloating
            pw={pw}
            tooglepw={tooglepw}
            icon="bi bi-lock-fill"
            text="Password"
            name="password"
            data={data}
            type={pw ? "text" : "password"}
            class="mt-8"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className={`flex flex-col mt-8 px-4`}>
          <Button color="blue-500" textColor="white" type="submit" >Login</Button>
          <a className={`text-sm text-blue-700 text-center mt-8`} href="#">Forgot Password?</a>
        </div>
      </div>
    </form>
  );
}

export default App;
