import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Card(props) {
  return (
    <div className={`bg-${props.bgColor} shadow-gray-300 shadow-lg rounded-lg p-4 w-58 ${props.class || ""}`}>
      <div className={`flex flex-col justify-center items-center`}>
        <div>
          <i className={`${props.icon} text-${props.iconColor} text-5xl mr-2`}></i>
        </div>
        <div className={`flex flex-col`}>
          <h2 className={`text-${props.text} font-bold text-lg`}>{props.title}</h2>
          <p className={`text-${props.text} font-semibold text-center text-sm`}>{props.description}</p>
        </div>
      </div>
    </div>
  );
}
function SideBar(props) {
  const items = [
    { name: "Beranda", icon: "bi bi-house-door-fill", class: props.view === "home" ? 'bg-green-900 border-l-green-700 border-l-4' : 'hover:bg-green-600', onClick: () => { props.setView("home") } },
    { name: "Data Siswa", icon: "bi bi-person-fill", class: props.view === "siswa" ? 'bg-green-900 border-l-green-700 border-l-4' : 'hover:bg-green-600', onClick: () => { props.setView("siswa") } },
    { name: "Data Obat", icon: "bi bi-capsule", class: props.view === "obat" ? 'bg-green-900 border-l-green-700 border-l-4' : 'hover:bg-green-600', onClick: () => { props.setView("obat") } },
    { name: "Daftar Kunjungan", icon: "bi bi-card-list", class: props.view === "kunjungan" ? 'bg-green-900 border-l-green-700 border-l-4' : 'hover:bg-green-600', onClick: () => { props.setView("kunjungan") } }
  ];

  const activeNav = items.findIndex(item => item.value === props.view)
  const itemHeight = 48;
  return (
    <div className={`w-full md:w-auto h-fit sm:h-screen bg-green-500 text-white ${props.class || ""}`}>
      <div className="p-2 md:p-4">
        <div className="flex flex-col sm:flex-row mb-2 md:mb-4 items-center">
          <img
            src={props.logo}
            alt="Logo"
            className={`${props.nav && props.hober ? 'w-8 h-8' : 'w-12 h-12 md:w-18 md:h-18'} sm:my-0 mb-2 mr-2`}
          />
          <div
            className={`flex flex-col w-full sm:items-start items-center justify-center
              ${props.nav && props.hober ? "opacity-0" : "opacity-100"}
              transition-all duration-500 ease-in-out
              ${props.nav && props.hober ? "hidden md:flex" : ""}
            `}
          >
            <h1 className="text-base lg:block sm:hidden font-bold">UKS</h1>
            <h2 className="text-xs lg:block sm:hidden font-bold">SMK Negeri 2 Tasikmalaya</h2>
          </div>
        </div>
        <ul className="flex sm:flex-col justify-center sm:justify-start md:space-y-2 h-12 md:h-screen relative">
          {activeNav !== -1 && (
            <div
              className="absolute left-0 w-full h-12 bg-green-700/80 rounded-lg z-0 transition-all duration-300"
            ></div>
          )}
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex z-10 items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out border-0 border-green-500 ${item.class || ""}`}
              onClick={item.onClick}
            >
              <i className={`${item.icon} mr-2 ${props.nav && props.hober ? 'absolute right-0' : ''}`}></i>
              <span className={`
                ${props.nav && props.hober ? 'opacity-0 hidden md:inline' : 'opacity-100'}
                transition-all duration-500 ease-in-out
                text-xs md:text-base
              `}>{item.name}</span>
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
        autoComplete={props.autoComplete || ''}
        value={props.value}
        onChange={props.onChange}
      />

      {props.text && (
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

      )}
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
      className={`bg-${props.color} cursor-pointer hover:opacity-50 ${props.sizeTxT ? props.sizeTxT : ''} ${props.width ? props.width : 'w-full'} p-2 text-${props.textColor} font-semibold rounded-sm`}
      type={props.type}
    >
      {props.children}
    </button>
  );
}
function Chart() {
  const data = {
    labels: ["Data siswa", "Data obat", "Daftar kunjungan", "Data surat"],
    datasets: [
      {
        label: "Jumlah",
        data: [600, 876, 364, 534],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(239, 68, 68, 0.7)"
        ],
        borderRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Statistik UKS" }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  return (
    <Bar data={data} options={options} className="w-full h-full mt-8" />
  )
}
function Table(props) {
  const Cari = (props.data || []).filter(item => {
    if (!props.cari) return true;
    const keyword = props.cari.toLowerCase();
    return (props.view === "siswa" ? (
      (item.nama && item.nama.toLowerCase().includes(keyword)) ||
      (item.kelas && item.kelas.toLowerCase().includes(keyword)) ||
      (item.nis && item.nis.toString().includes(keyword))
    ) :props.view === "obat" ? (
      (item.nama_obat && item.nama_obat.toLowerCase().includes(keyword)) ||
      (item.kode_obat && item.kode_obat.toLowerCase().includes(keyword)) ||
      (item.kandungan && item.kandungan.toLowerCase().includes(keyword)) ||
      (item.jenis_obat && item.jenis_obat.toLowerCase().includes(keyword))
    ):props.view === "kunjungan" ? (
      (item.nama && item.nama.toLowerCase().includes(keyword)) ||
      (item.kelas && item.kelas.toLowerCase().includes(keyword)) ||
      (item.tanggal && item.tanggal.toLowerCase().includes(keyword)) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(keyword))
    ): '');
  })
  return (
    <div className="relative overflow-x-auto w-full rounded-sm">
      <table className="w-full text-sm text-left text-black">
        <thead className="text-xs text-gray-900 uppercase bg-gray-500">
          <tr>
            {props.view === "siswa" ? (
              <>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                <th scope="col" className="px-6 py-3">Kelas</th>
                <th scope="col" className="px-6 py-3">NIS</th>
                <th scope="col" className="px-6 py-3">Tinggi&nbsp;Badan</th>
                <th scope="col" className="px-6 py-3">Berat&nbsp;Badan</th>
                <th scope="col" className="px-6 py-3">Golongan&nbsp;Darah</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </>) :props.view === "obat" ? (
              <>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Nama Obat</th>
                <th scope="col" className="px-6 py-3">Kode Obat</th>
                <th scope="col" className="px-6 py-3">Jenis Obat</th>
                <th scope="col" className="px-6 py-3">Kandungan Obat</th>
                <th scope="col" className="px-6 py-3">Stock Obat</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </>
            ): props.view === "kunjungan" ? (
              <>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Nama</th>
                <th scope="col" className="px-6 py-3">Kelas</th>
                <th scope="col" className="px-6 py-3">Tanggal</th>
                <th scope="col" className="px-6 py-3">Keterangan</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </>
            ) : ''}
          </tr>
        </thead>
        <tbody>
          {Cari.length === 0 ? (
            <tr>
              <td colSpan={props.view === "siswa" ? 8 : props.view === "obat" ? 7 : props.view === "kunjungan" ? 6 : 1} className="text-center py-4">
                Data tidak ada
              </td>
            </tr>
          ) : (
            Cari.map((item, index) => (
              <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-300'} border-b border-gray-200`} key={index}>
                <td className="px-6 py-4">{index + 1}</td>
                {props.view === "siswa" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.nama}</td>
                    <td className="px-6 py-4 uppercase">{item.kelas}</td>
                    <td className="px-6 py-4">{item.nis}</td>
                    <td className="px-6 py-4">{item.tinggi_badan}</td>
                    <td className="px-6 py-4">{item.berat_badan}</td>
                    <td className="px-6 py-4">{item.golongan_darah}</td>
                  </>) : props.view === "obat" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.nama_obat}</td>
                    <td className="px-6 py-4 uppercase">{item.kode_obat}</td>
                    <td className="px-6 py-4">{item.jenis_obat}</td>
                    <td className="px-6 py-4">{item.kandungan}</td>
                    <td className="px-6 py-4">{item.stock_obat}</td>
                  </>
                ): props.view === "kunjungan" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.nama}</td>
                    <td className="px-6 py-4 uppercase">{item.kelas}</td>
                    <td className="px-6 py-4">{item.tanggal}</td>
                    <td className="px-6 py-4">{item.keterangan}</td>
                  </>
                ) : ''}
                <td className="px-6 py-4 flex">
                  <button onClick={() => {
                    props.setData(item);
                    props.setM();
                    props.funcName("edit")
                  }} className="text-white hover:shadow-lg hover:shadow-gray-300 transition-all duration-300 ease-in-out hover:bg-blue-400 bg-blue-500 rounded-lg p-2">
                    <i className="bi bi-pen-fill"></i>&nbsp;Edit
                  </button>
                  <button onClick={() => {
                    props.setData(item);
                    props.setM();
                    props.funcName("delete")
                  }} className="text-white hover:shadow-lg hover:shadow-gray-300 transition-all duration-300 ease-in-out hover:bg-red-400 bg-red-500 rounded-lg p-2 ml-2">
                    <i className="bi bi-trash-fill"></i>&nbsp;Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
function Modal(props) {
  const fields = props.view === "siswa"
    ? [
      { name: "nama", label: "Nama" },
      { name: "kelas", label: "Kelas" },
      { name: "nis", label: "NIS" },
      { name: "tinggi_badan", label: "Tinggi Badan" },
      { name: "berat_badan", label: "Berat Badan" },
      { name: "golongan_darah", label: "Golongan Darah" }
    ]
    :props.view === "obat" ? [
      { name: "nama_obat", label: "Nama Obat" },
      { name: "kode_obat", label: "Kode Obat" },
      { name: "kandungan", label: "Kandungan Obat" },
      { name: "stock_obat", label: "Stock Obat" },
      { name: "jenis_obat", label: "Jenis Obat" }
    ]: props.view === "kunjungan" ? [
      { name: "nama", label: "Nama" },
      { name: "kelas", label: "Kelas" },
      { name: "tanggal", label: "Tanggal" },
      { name: "keterangan", label: "Keterangan" }
    ] : [];

  const [form, setForm] = useState({});
  const [error, setError] = useState({});

  useEffect(() => {
    setForm(props.data || {});
  }, [props.data, props.statE]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (props.name === "edit" || props.name === "insert") {
      let hasError = false;
      let newError = {};
      fields.forEach(field => {
        if (!form[field.name]) {
          hasError = true;
          newError[field.name] = `${field.label} tidak boleh kosong`;
        }
      });
      setError(newError);
      if (hasError) return;
    }
    props.onSubmit(form);
  };


  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${props.stat ? 'block' : 'hidden'} backdrop-blur-sm`}>
      <div className={`bg-white relative rounded-lg shadow-lg p-6 w-96`}>
        <h2 className="text-xl font-bold mb-4">{props.title}</h2>
        <div className="flex flex-col gap-2 mb-4"><i onClick={props.setM} className={`bi bi-x-lg absolute top-6 right-6 cursor-pointer`}></i>
          {props.name === "edit" ? fields.map(field => (
            <div key={field.name}>
              <label className="text-gray-500">{field.label}</label>
              {field.name === "golongan_darah" ? (
                <select
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                >
                  <option disabled value="">Pilih Golongan Darah</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : field.name === 'jenis_obat' ? (
                <select
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                >
                  <option disabled value="">Pilih Jenis Obat</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Sirup">Sirup</option>
                  <option value="Kapsul">Kapsul</option>
                  <option value="Salep">Salep</option>
                </select>
              ):field.name === "tanggal"? (
                <input
                  type="date"
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          )) : props.name === "delete" ? (
            <div className="text-center">Apakah anda yakin ingin mengahapus data <p className={`font-bold`}>{props.data && (props.data.nama || props.data.nama_obat)}</p></div>
          ) : props.name === "insert" && fields.map(field => (
            <div key={field.name}>
              <label className="text-gray-500">{field.label}</label>
              {field.name === "golongan_darah" ? (
                <select
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                >
                  <option disabled value="">Pilih Golongan Darah</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : field.name === 'jenis_obat' ? (
                <select
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                >
                  <option disabled selected value="">Pilih Jenis Obat</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Sirup">Sirup</option>
                  <option value="Kapsul">Kapsul</option>
                  <option value="Salep">Salep</option>
                </select>
              ):field.name === "tanggal"? (
                <input
                  type="date"
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  name={field.name}
                  className={`w-full ${error[field.name] ? 'border-red-500' : 'border-gray-500'} border-gray-500 focus:outline-none border-b-1 focus:border-b-blue-500 focus:text-blue-500 transition-all duration-300 ease-in-out p-2`}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit} color={props.name === 'edit' ? 'blue-500' : props.name === 'delete' ? 'red-500' : props.name === 'insert' && 'blue-500'} textColor="white">
          {props.name === 'edit' ? 'Simpan' : props.name === 'insert' ? 'Tambahkan' : props.name === 'delete' && 'Hapus'}
        </Button>
      </div>
    </div>
  );
}
export { FormFloating, Button, SideBar, Card, Chart, Table, Modal };
