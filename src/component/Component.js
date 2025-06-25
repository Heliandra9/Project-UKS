import React from "react";

function SideBar(props) {
  const items = [
    { name: "Home", icon: "bi bi-house-door-fill", onClick: ()=>{props.setView("home")} },
    { name: "Profile", icon: "bi bi-person-fill", onClick: ()=>{props.setView("profil")} },
    { name: "Settings", icon: "bi bi-gear-fill" , onClick: ()=>{props.setView("setting")}},
    { name: "Logout", icon: "bi bi-box-arrow-right", class: `w-full font-bold justify-center flex text-red-500 absolute ${props.nav && props.hober ?'bottom-44 p-2' :'bottom-32'} bg-white`, onClick: props.logot }
  ];

  const activeNav = items.findIndex(item => item.value === props.view)
  const itemHeight = 48;
  return (
    <div className={`w-full h-screen bg-green-500 text-white ${props.class || ""}`}>
      <div className="p-4">
        <div className="flex mb-4">
          <img src={props.logo} alt="Logo" className={`${props.nav && props.hober ?'w-8 h-8' :'w-18 h-18'} mr-2`} />
          <div className={`flex flex-col w-full justify-center ${props.nav && props.hober ? "opacity-0" : "opacity-100"} transition-all duration-500 ease-in-out`}>
            <h1 className="text-lg font-bold">UKS</h1>
            <h2 className="text-md font-bold">SMK Negeri 2 Tasikmalaya</h2>
          </div>
        </div>
        <ul className="space-y-2 h-screen relative">
          {activeNav !== -1 && (
            <div
              className="absolute left-0 w-full h-12 bg-green-700/80 rounded-lg z-0 transition-all duration-300"
              style={{ top: `${activeNav * (itemHeight + 8)}px` }}
            ></div>
          )}
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex z-10 items-center p-2 hover:bg-green-600 rounded-lg cursor-pointer ${item.class || ""}`}
              onClick={item.onClick}
            >
              <i className={`${item.icon} mr-2 ${props.nav && props.hober ?'absolute right-0' :''}`}></i>
              <span className={`${props.nav && props.hober ?'opacity-0' :'opacity-100'} transition-all duration-500 ease-in-out`}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function FormFloating(props) {
  const isError = props.data === 'Invalid username or password';
  const borderColor = isError ? 'border-red-500' : 'border-gray-300';
  const iconColor = isError ? 'text-red-500' : 'text-gray-500';

  return (
    <div className={`relative ${props.class || ""}`}>
      <input
        type={props.type}
        id={props.name}
        name={props.name}
        className={`block px-2.5 pb-2.5 pt-4 ${borderColor} w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
        value={props.value}
        onChange={props.onChange}
      />

      <label
        htmlFor={props.name}
        className={`absolute ${iconColor} text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
        peer-focus:px-2 peer-focus:text-blue-600 
        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
      >
        <i className={props.icon}></i>&nbsp;{props.text}
      </label>

      {props.name === "password" && (
        <span onClick={props.tooglepw} className={`absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer ${iconColor} hover:text-gray-600`}>
          <i className={`${props.pw ? 'bi bi-eye' : 'bi bi-eye-slash'}`}></i>
        </span>
      )}
    </div>
  );
}

function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className={`bg-${props.color} cursor-pointer hover:opacity-50 w-full p-2 text-${props.textColor} font-semibold rounded-2xl`}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

export { FormFloating, Button, SideBar };
