import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiX } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Card(props) {
  return (
    <div
      className={`bg-${props.bgColor
        } shadow-gray-300 shadow-lg rounded-lg p-4 w-58 ${props.class || ""}`}
    >
      <div className={`flex flex-col justify-center items-center`}>
        <div>
          <i
            className={`${props.icon} text-${props.iconColor} text-5xl mr-2`}
          ></i>
        </div>
        <div className={`flex flex-col`}>
          <h2 className={`text-${props.text} font-bold text-lg`}>
            {props.title}
          </h2>
          <p className={`text-${props.text} font-semibold text-center text-sm`}>
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
}
function SideBar(props) {
  const items = [
    {
      name: "Beranda",
      icon: "bi bi-house-door-fill",
      class:
        props.view === "home"
          ? "bg-green-900 border-l-green-700 border-l-4"
          : "hover:bg-green-600",
      onClick: () => {
        props.setView("home");
      },
    },
    {
      name: "Data Siswa",
      icon: "bi bi-person-fill",
      class:
        props.view === "siswa"
          ? "bg-green-900 border-l-green-700 border-l-4"
          : "hover:bg-green-600",
      onClick: () => {
        props.setView("siswa");
      },
    },
    {
      name: "Data Obat",
      icon: "bi bi-capsule",
      class:
        props.view === "obat"
          ? "bg-green-900 border-l-green-700 border-l-4"
          : "hover:bg-green-600",
      onClick: () => {
        props.setView("obat");
      },
    },
    {
      name: "Daftar Kunjungan",
      icon: "bi bi-card-list",
      class:
        props.view === "kunjungan"
          ? "bg-green-900 border-l-green-700 border-l-4"
          : "hover:bg-green-600",
      onClick: () => {
        props.setView("kunjungan");
      },
    },
    {
      name: "Kelola User",
      icon: "bi bi-people-fill",
      class:
        props.view === "user"
          ? "bg-green-900 border-l-green-700 border-l-4"
          : "hover:bg-green-600",
      onClick: () => {
        props.setView("user");
      },
    },
  ];

  const activeNav = items.findIndex((item) => item.value === props.view);
  const itemHeight = 48;
  return (
    <div
      className={`w-full md:w-auto h-fit sm:h-screen bg-green-500 text-white ${props.class || ""
        }`}
    >
      <div className="p-2 md:p-4">
        <div className="flex flex-col sm:flex-row mb-2 md:mb-4 items-center">
          <img
            src={props.logo}
            alt="Logo"
            className={`${props.nav && props.hober ? "w-8 h-8" : "w-12 h-12 md:w-18 md:h-18"
              } sm:my-0 mb-2 mr-2`}
          />
          <div
            className={`flex flex-col w-full sm:items-start items-center justify-center
              ${props.nav && props.hober ? "opacity-0" : "opacity-100"}
              transition-all duration-500 ease-in-out
              ${props.nav && props.hober ? "hidden md:flex" : ""}
            `}
          >
            <h1 className="text-base lg:block sm:hidden font-bold">UKS</h1>
            <h2 className="text-xs lg:block sm:hidden font-bold">
              SMK Negeri 2 Tasikmalaya
            </h2>
          </div>
        </div>
        <ul className="flex sm:flex-col justify-center sm:justify-start md:space-y-2 h-12 md:h-screen relative">
          {activeNav !== -1 && (
            <div className="absolute left-0 w-full h-12 bg-green-700/80 rounded-lg z-0 transition-all duration-300"></div>
          )}
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex z-10 items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out border-0 border-green-500 ${item.class || ""
                }`}
              onClick={item.onClick}
            >
              <i
                className={`${item.icon} mr-2 ${props.nav && props.hober ? "absolute right-0" : ""
                  }`}
              ></i>
              <span
                className={`
                ${props.nav && props.hober
                    ? "opacity-0 hidden md:inline"
                    : "opacity-100"
                  }
                transition-all duration-500 ease-in-out
                text-xs md:text-base
              `}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function FormFloating(props) {
  const isError = props.data === "Invalid username or password";
  const borderColor = isError ? "border-red-500" : "border-gray-300";
  const iconColor = isError ? "text-red-500" : "text-gray-500";

  return (
    <div className={`relative ${props.class || ""}`}>
      <input
        type={props.type}
        id={props.name}
        name={props.name}
        className={`block px-2.5 pb-2.5 pt-4 ${borderColor} w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
        autoComplete={props.autoComplete || ""}
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
        <span
          onClick={props.tooglepw}
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer ${iconColor} hover:text-gray-600`}
        >
          <i className={`${props.pw ? "bi bi-eye" : "bi bi-eye-slash"}`}></i>
        </span>
      )}
    </div>
  );
}

function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className={`bg-${props.color} cursor-pointer hover:opacity-50 ${props.sizeTxT ? props.sizeTxT : ""
        } ${props.width ? props.width : "w-full"} p-2 text-${props.textColor
        } font-semibold rounded-sm`}
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
          "rgba(239, 68, 68, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Statistik UKS" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  return <Bar data={data} options={options} className="w-full h-full mt-8" />;
}
function Table(props) {
  const Cari = (props.data || []).filter((item) => {
    if (!props.cari) return true;
    const keyword = props.cari.toLowerCase();
    return props.view === "siswa"
      ? (item.nama && item.nama.toLowerCase().includes(keyword)) ||
      (item.kelas && item.kelas.toLowerCase().includes(keyword)) ||
      (item.nis && item.nis.toString().includes(keyword))
      : props.view === "obat"
        ? (item.nama_obat && item.nama_obat.toLowerCase().includes(keyword)) ||
        (item.kode_obat && item.kode_obat.toLowerCase().includes(keyword)) ||
        (item.kandungan && item.kandungan.toLowerCase().includes(keyword)) ||
        (item.satuan && item.satuan.toLowerCase().includes(keyword))
        : props.view === "user"
          ? (item.username && item.username.toLowerCase().includes(keyword)) ||
          (item.password && item.password.toLowerCase().includes(keyword)) ||
          (item.tipe_user && item.tipe_user.toLowerCase().includes(keyword))
          : props.view === "kunjungan"
            ? (item.nama_siswa && item.nama_siswa.toLowerCase().includes(keyword)) ||
            (item.kelas && item.kelas.toLowerCase().includes(keyword)) ||
            (item.keluhan && item.keluhan.toLowerCase().includes(keyword)) ||
            (item.tanggal_kunjungan && item.tanggal_kunjungan.toLowerCase().includes(keyword)) ||
            (item.nama_obat_kunjungan && item.nama_obat_kunjungan.toLowerCase().includes(keyword)) ||
            (item.keterangan && item.keterangan.toLowerCase().includes(keyword))
            : false;
  });

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
              </>
            ) : props.view === "obat" ? (
              <>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Nama Obat</th>
                <th scope="col" className="px-6 py-3">Kode Obat</th>
                <th scope="col" className="px-6 py-3">Jenis Obat</th>
                <th scope="col" className="px-6 py-3">Kandungan Obat</th>
                <th scope="col" className="px-6 py-3">Stock Obat</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </>
            ) : props.view === "kunjungan" ? (
              <>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Nama</th>
                <th scope="col" className="px-6 py-3">Kelas</th>
                <th scope="col" className="px-6 py-3">Keluhan</th>
                <th scope="col" className="px-6 py-3">Tanggal Kunjungan</th>
                <th scope="col" className="px-6 py-3">Keterangan</th>
                <th scope="col" className="px-6 py-3">Resep Obat Diberikan</th>
                <th scope="col" className="px-6 py-3">Qty Obat</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </>
            ) : props.view === "user" ? (
              <>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Password</th>
                <th scope="col" className="px-6 py-3">Tipe User</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody>
          {Cari.length === 0 ? (
            <tr>
              <td
                colSpan={
                  props.view === "siswa"
                    ? 8
                    : props.view === "obat"
                      ? 7
                      : props.view === "kunjungan"
                        ? 10
                        : props.view === "user"
                          ? 5
                          : 1
                }
                className="text-center py-4"
              >
                Data tidak ada
              </td>
            </tr>
          ) : (
            Cari.map((item, index) => (
              <tr
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-300"} border-b border-gray-200`}
                key={index}
              >
                <td className="px-6 py-4">{index + 1}</td>
                {props.view === "siswa" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.nama}</td>
                    <td className="px-6 py-4 uppercase">{item.kelas}</td>
                    <td className="px-6 py-4">{item.nis}</td>
                    <td className="px-6 py-4">{item.tinggi_badan}</td>
                    <td className="px-6 py-4">{item.berat_badan}</td>
                    <td className="px-6 py-4">{item.golongan_darah}</td>
                  </>
                ) : props.view === "obat" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.nama_obat}</td>
                    <td className="px-6 py-4 uppercase">{item.kode_obat}</td>
                    <td className="px-6 py-4">{item.jenis_obat}</td>
                    <td className="px-6 py-4">{item.kandungan}</td>
                    <td className="px-6 py-4">{item.stock_dengan_satuan}</td>
                  </>
                ) : props.view === "kunjungan" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.nama_siswa}</td>
                    <td className="px-6 py-4 uppercase">{item.kelas}</td>
                    <td className="px-6 py-4">{item.keluhan}</td>
                    <td className="px-6 py-4">{item.nama_obat_kunjungan || "-"}</td>
                    <td className="px-6 py-4">{item.tanggal}</td> {/* tanggal kunjungan */}
                    <td className="px-6 py-4">{item.qty || '-'}</td> {/* qty obat */}
                    <td className="px-6 py-4">{item.tanggal_kunjungan || '-'}</td> {/* tanggal obat */}
                    <td className="px-6 py-4">{item.keterangan}</td>

                  </>
                ) : props.view === "user" ? (
                  <>
                    <td className="px-6 py-4 capitalize">{item.username}</td>
                    <td className="px-6 py-4">{item.password}</td>
                    <td className="px-6 py-4">{item.tipe_user}</td>
                  </>
                ) : null}
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      props.setData(item);
                      props.setM();
                      props.funcName("edit");
                    }}
                    className="text-white hover:shadow-lg hover:shadow-gray-300 transition-all duration-300 ease-in-out hover:bg-blue-400 bg-blue-500 rounded-lg p-2"
                  >
                    <i className="bi bi-pen-fill"></i>&nbsp;Edit
                  </button>
                  <button
                    onClick={() => {
                      props.setData(item);
                      props.setM();
                      props.funcName("delete");
                    }}
                    className="text-white hover:shadow-lg hover:shadow-gray-300 transition-all duration-300 ease-in-out hover:bg-red-400 bg-red-500 rounded-lg p-2"
                  >
                    <i className="bi bi-trash-fill"></i>&nbsp;Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Modal(props) {
  // Define fields per view
  const fields =
    props.view === "siswa"
      ? [
        { name: "nama", label: "Nama" },
        { name: "kelas", label: "Kelas" },
        { name: "nis", label: "NIS" },
        { name: "tinggi_badan", label: "Tinggi Badan" },
        { name: "berat_badan", label: "Berat Badan" },
        { name: "golongan_darah", label: "Golongan Darah" },
      ]
      : props.view === "obat"
        ? [
          { name: "id_obat", label: "ID Obat", hidden: true }, // opsional tanda hidden
          { name: "nama_obat", label: "Nama Obat" },
          { name: "kode_obat", label: "Kode Obat" },
          { name: "kandungan", label: "Kandungan Obat" },
          { name: "stock_obat", label: "Stock Obat" },
          { name: "satuan", label: "Jenis Obat" },
        ]
        : props.view === "kunjungan"
          ? [
            { name: "kelas", label: "Kelas" },
            { name: "id_siswa", label: "Nama" },
            ...(props.name === "edit" ? [{ name: "tanggal", label: "Tanggal" }] : []),
            { name: "keluhan", label: "Keluhan siswa" },
            { name: "obat", label: "Resep Diberikan" },
            { name: "keterangan", label: "Keterangan" },
          ]
          : props.view === "user"
            ? [
              { name: "username", label: "Username" },
              { name: "password", label: "Password" },
              { name: "tipe_user", label: "Tipe User" },
            ]
            : [];

  const defaultFormByView = {
    siswa: {
      nama: "",
      kelas: "",
      nis: "",
      tinggi_badan: "",
      berat_badan: "",
      golongan_darah: "",
    },
    obat: {
      id_obat: "", // tambahkan ini
      nama_obat: "",
      jenis_obat: "",
      kode_obat: "",
      kandungan: "",
      stock_dengan_satuan: "",
    },
    kunjungan: {
      kelas: "",
      id_siswa: "",
      keluhan: "",
      obat: [], // array obat dengan properti id_obat, nama, jumlah, satuan
      keterangan: "",
    },
    user: {
      username: "",
      password: "",
      tipe_user: "",
    },
  };

  const [localForm, setLocalForm] = React.useState(
    props.data
      ? { ...defaultFormByView[props.view], ...props.data }
      : defaultFormByView[props.view] || {}
  );
  const [localError, setLocalError] = React.useState({});

  const form = props.form ?? localForm;
  const setForm = props.setForm ?? setLocalForm;
  const error = props.error ?? localError;
  const setError = props.setError ?? setLocalError;

  const listKelas =
    props.view === "kunjungan" && props.siswa
      ? [...new Set(props.siswa.map((s) => s.kelas.trim()))]
      : [];
  const filteredNama =
    props.view === "kunjungan" && props.siswa && form.kelas
      ? props.siswa.filter((s) => s.kelas === form.kelas)
      : [];

  React.useEffect(() => {
    if (props.view !== "kunjungan") {
      setForm(
        props.data
          ? { ...defaultFormByView[props.view], ...props.data }
          : defaultFormByView[props.view] || {}
      );
      setError({});
    }
  }, [props.data, props.statE, props.view, setForm, setError]);

  const handleChange = (e) => {
    if (props.view === "kunjungan") {
      const { name, value, multiple, options } = e.target;
      if (multiple) {
        const selected = Array.from(options)
          .filter((o) => o.selected)
          .map((o) => o.value);
        setForm((prev) => ({ ...prev, [name]: selected }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: value,
          ...(name === "kelas" ? { id_siswa: "" } : {}),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = () => {
    let newError = {};
    let hasError = false;

    if (props.name === "edit" || props.name === "insert") {
      fields.forEach((field) => {
        if (
          field.name === "id_siswa" &&
          (!form.id_siswa || form.id_siswa === "")
        ) {
          newError.id_siswa = "Nama siswa harus dipilih";
          hasError = true;
          return;
        }
        const val = form[field.name];
        if (
          val === undefined ||
          val === null ||
          (typeof val === "string" && val.trim().length === 0) ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newError[field.name] = `${field.label} tidak boleh kosong`;
          hasError = true;
        }
      });
    }

    setError(newError);
    if (!hasError) props.onSubmit(form);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${props.stat ? "block" : "hidden"
        } backdrop-blur-sm`}
    >
      <div className="bg-white relative rounded-xl shadow-2xl p-8 w-full max-w-lg max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {props.title}
        </h2>
        <i
          onClick={props.setM}
          className="bi bi-x-lg absolute top-4 right-4 cursor-pointer text-xl text-gray-500 hover:text-gray-700"
        ></i>
        <div className="flex flex-col gap-4 mb-6 overflow-y-auto max-h-[60vh]">
          {props.name !== "delete" ? (
            <>
              {props.view === "kunjungan" && (
                <>
                  {/* Field Hidden obat id_obat sudah tersimpan di setiap item */}
                  {(form.obat || []).map((obat, idx) => (
                    <input
                      key={`hidden-idobat-${idx}`}
                      type="hidden"
                      name={`obat[${idx}][id_obat]`}
                      value={obat.id_obat || ""}
                    />
                  ))}
                </>
              )}

              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    {field.label}
                  </label>

                  {field.name === "kelas" ? (
                    <select
                      name="kelas"
                      value={form?.kelas ?? ""}
                      onChange={handleChange}
                      className="w-full p-3 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {listKelas.map((kelas, idx) => (
                        <option key={idx} value={kelas}>
                          {kelas}
                        </option>
                      ))}
                    </select>
                  ) : field.name === "id_siswa" ? (
                    <select
                      name="id_siswa"
                      value={form?.id_siswa ?? ""}
                      onChange={handleChange}
                      disabled={!form?.kelas}
                      className={`block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm sm:text-sm ${!form?.kelas
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                    >
                      <option value="">-- Pilih Kelas dahulu --</option>
                      {filteredNama.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama}
                        </option>
                      ))}
                    </select>
                  ) : field.name === "tanggal" && props.name === "edit" ? (
                    <input
                      type="date"
                      name="tanggal"
                      value={form?.tanggal ?? ""}
                      onChange={handleChange}
                      className={`w-full p-3 border-b ${error[field.name] ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  ) : field.name === "obat" ? (
                    <div className="space-y-4">
                      {/* Obat Terpilih */}
                      <div className="flex flex-wrap gap-2">
                        {(form.obat || []).map((obat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full shadow-sm"
                          >
                            <input
                              type="hidden"
                              name={`obat[${idx}][id_obat]`}
                              value={obat.id_obat || ""}
                            />
                            <span className="mr-2">{obat.nama}</span>
                            <input
                              type="number"
                              min="1"
                              value={obat.jumlah}
                              onChange={(e) => {
                                const newObat = [...form.obat];
                                newObat[idx].jumlah = parseInt(e.target.value) || 1;
                                setForm({ ...form, obat: newObat });
                              }}
                              className="w-10 bg-transparent border-b border-blue-300 text-sm text-center focus:outline-none"
                            />
                            <span className="ml-2 text-sm">{obat.satuan}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newObat = form.obat.filter((_, i) => i !== idx);
                                setForm({ ...form, obat: newObat });
                              }}
                              className="ml-2 text-blue-600 hover:text-red-500"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* List Obat */}
                      <div className="border border-gray-300 rounded-xl p-2 max-h-48 overflow-y-auto shadow-inner">
                        {(!props.obat || props.obat.length === 0) && (
                          <p className="text-sm text-gray-500 text-center">
                            Tidak ada data obat
                          </p>
                        )}
                        {(props.obat || []).map((obat) => {
                          const index = form.obat?.findIndex(
                            (o) => o.id_obat === obat.id
                          );
                          const isSelected = index !== -1;

                          return (
                            <div
                              key={obat.id}
                              onClick={() => {
                                if (isSelected) {
                                  const newObat = [...form.obat];
                                  newObat[index].jumlah += 1;
                                  setForm({ ...form, obat: newObat });
                                } else {
                                  setForm({
                                    ...form,
                                    obat: [
                                      ...(form.obat || []),
                                      {
                                        id_obat: obat.id,
                                        nama: obat.nama_obat,
                                        jumlah: 1,
                                        satuan:
                                          obat.jenis_obat === "Sirup" ? "ml" : "pcs",
                                      },
                                    ],
                                  });
                                }
                              }}
                              className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition-all mb-1 ${isSelected
                                ? "bg-blue-100 text-blue-800 font-semibold"
                                : "hover:bg-gray-100"
                                }`}
                            >
                              <span>{obat.nama_obat}</span>
                              <span className="text-xs text-gray-500">
                                Stok: {obat.stock_dengan_satuan}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <input
                      name={field.name}
                      value={form?.[field.name] ?? ""}
                      onChange={handleChange}
                      className={`w-full p-3 border-b ${error[field.name] ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      type={field.name === "password" ? "password" : "text"}
                      autoComplete={field.name === "password" ? "new-password" : undefined}
                    />
                  )}
                  {error[field.name] && (
                    <p className="text-red-500 text-sm">{error[field.name]}</p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-lg text-gray-700">
              Apakah anda yakin ingin menghapus data{" "}
              <p className="font-bold">
                {props.data?.nama ||
                  props.data?.nama_obat ||
                  props.data?.username ||
                  ""}
              </p>
              ?
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-md text-white ${props.name === "edit" || props.name === "insert"
            ? "bg-blue-600"
            : "bg-red-600"
            } hover:bg-opacity-90`}
        >
          {props.name === "edit"
            ? "Simpan"
            : props.name === "insert"
              ? "Tambahkan"
              : "Hapus"}
        </button>
      </div>
    </div>
  );
}



export { FormFloating, Button, SideBar, Card, Chart, Table, Modal };
