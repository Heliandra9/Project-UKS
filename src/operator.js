import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Operator() {
  const [obat, setObat] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const [kelas, setKelas] = useState("");
  const [idSiswa, setIdSiswa] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const toggleLogout = () => setShowLogout(!showLogout);

  const logot = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };

  // Ambil data dari backend
  useEffect(() => {
    fetch(
      "http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=obat"
    )
      .then((res) => res.json())
      .then((data) => setObat(data))
      .catch((err) => console.error("Gagal ambil data obat:", err));

    fetch(
      "http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=siswa"
    )
      .then((res) => res.json())
      .then((data) => setSiswa(data))
      .catch((err) => console.error("Gagal ambil data siswa:", err));
  }, []);

  const filteredObat = obat.filter(
    (o) =>
      o.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedKategori === "semua" || o.id_kategori === selectedKategori)
  );

  const filteredSiswa = siswa.filter((s) => s.kelas === kelas);

  const tambahTransaksi = (obatItem) => {
    setTransaksi((prev) => {
      const index = prev.findIndex((item) => item.obat.id === obatItem.id);
      const parts = (obatItem.stock_dengan_satuan || "0 pcs").split(" ");
      const stok = parseInt(parts[0], 10);
      const satuan = parts[1] || "pcs";
      const increment = satuan.toLowerCase() === "ml" ? 5 : 1;

      if (index !== -1) {
        const item = prev[index];
        const currentQty = quantities[item.obat.id] || item.qty;
        if (currentQty + increment > stok) {
          Swal.fire({
            icon: "error",
            title: "Stok tidak cukup",
            timer: 1500,
            showConfirmButton: false,
          });
          return prev;
        }
        const update = [...prev];
        update[index] = { ...item, qty: currentQty + increment };
        setQuantities((q) => ({
          ...q,
          [item.obat.id]: currentQty + increment,
        }));
        return update;
      } else {
        if (stok < increment) {
          Swal.fire({
            icon: "error",
            title: "Stok habis",
            timer: 1500,
            showConfirmButton: false,
          });
          return prev;
        }
        setQuantities((q) => ({ ...q, [obatItem.id]: increment }));
        return [...prev, { obat: obatItem, qty: increment }];
      }
    });
  };

  const updateQuantity = (obatId, newQty) => {
    setTransaksi((prev) =>
      prev
        .map((item) =>
          item.obat.id === obatId ? { ...item, qty: newQty } : item
        )
        .filter((item) => item.qty > 0)
    );
    setQuantities((prev) => {
      const newQ = { ...prev, [obatId]: newQty };
      if (newQty <= 0) delete newQ[obatId];
      return newQ;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between px-6 bg-gray-800 py-4">
        <div className="w-1/6 flex items-center">
          <h1 className="text-2xl font-bold text-white">UKS Sekolah</h1>
        </div>
        <div className="flex gap-4 w-full justify-end relative">
          <div
            onClick={toggleLogout}
            className="text-white flex items-center cursor-pointer"
          >
            {localStorage.getItem("username")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 ml-2 ${
                showLogout ? "rotate-180" : ""
              } transition-transform duration-150`}
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
            {showLogout && (
              <div className="absolute top-10 right-0 bg-red-500 cursor-pointer rounded-md shadow-lg w-36 animate-fade-in z-20">
                <ul className="text-white m-0 p-0">
                  <li className="py-2 px-2">
                    <button
                      onClick={logot}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full justify-center"
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 overflow-hidden min-h-[600px]">
        {/* Form Pasien */}
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200">
          <h2 className="font-bold text-xl">Form Pasien</h2>
          <select
            value={kelas}
            onChange={(e) => {
              setKelas(e.target.value);
              setIdSiswa("");
            }}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Pilih Kelas --</option>
            {[...new Set(siswa.map((s) => s.kelas))].map((k, idx) => (
              <option key={idx} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            disabled={!kelas}
            value={idSiswa}
            onChange={(e) => setIdSiswa(e.target.value)}
            className={`border p-2 rounded w-full ${
              !kelas ? "bg-gray-100 text-gray-400" : ""
            }`}
          >
            <option value="">
              {!kelas ? "-- Pilih kelas dahulu --" : "-- Pilih Siswa --"}
            </option>
            {filteredSiswa.map((s) => (
              <option key={s.id_siswa} value={s.id_siswa}>
                {s.nama}
              </option>
            ))}
          </select>
          <textarea
            rows={3}
            value={keluhan}
            onChange={(e) => setKeluhan(e.target.value)}
            placeholder="Keluhan pasien..."
            className="border p-2 rounded resize-none w-full"
          />
        </div>

        {/* List Obat */}
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-lg p-4 border border-gray-200 flex flex-col gap-3">
          <h2 className="font-bold text-xl">List Obat Tersedia</h2>
          <input
            type="text"
            placeholder="Cari obat..."
            className="border p-2 rounded mb-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto flex-1 max-h-[500px] scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 p-2">
            {filteredObat.length ? (
              filteredObat.map((o) => (
                <div
                  key={o.id}
                  onClick={() => tambahTransaksi(o)}
                  className="cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-between hover:scale-105 transition-transform duration-150 h-[150px]"
                >
                  <img
                    src={`/logo/${o.gambar}`}
                    alt={o.nama_obat}
                    className="w-full h-16 object-cover rounded-md"
                  />
                  <p className="font-semibold text-center text-sm truncate">
                    {o.nama_obat}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stok: {o.stock_dengan_satuan}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-400">
                Obat tidak ditemukan
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Resep diberikan */}
      <div className="flex flex-col gap-2 bg-white rounded-2xl shadow-lg p-4 mt-1 border border-gray-200 m-4 min-h-[200px]">
        <h2 className="font-bold text-xl">Resep Diberikan:</h2>
        <div className="overflow-x-auto flex gap-3 p-2">
          {transaksi.length ? (
            transaksi.map((item) => {
              const parts = item.obat.stock_dengan_satuan.split(" ");
              const stok = parseInt(parts[0], 10);
              const satuan = parts[1];
              const currentQty = quantities[item.obat.id] || item.qty;
              return (
                <div
                  key={item.obat.id}
                  className="min-w-[150px] bg-green-50 rounded-lg p-2 flex flex-col items-center"
                >
                  <p className="font-semibold text-center">
                    {item.obat.nama_obat}
                  </p>
                  <div className="flex justify-between items-center w-full mt-1">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.obat.id,
                          currentQty - (satuan.toLowerCase() === "ml" ? 5 : 1)
                        )
                      }
                      className="bg-red-100 text-red-600 p-1 rounded-full"
                    >
                      -
                    </button>
                    <span>
                      {currentQty} {satuan}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.obat.id,
                          currentQty + (satuan.toLowerCase() === "ml" ? 5 : 1)
                        )
                      }
                      className="bg-green-100 text-green-600 p-1 rounded-full"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    Stok: {stok} {satuan}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">Belum ada obat dipilih</p>
          )}
        </div>
      </div>

      {/* Tombol Konfirmasi */}
      <button className="flex items-center justify-center gap-2 px-4 py-3 mt-1 bg-green-600 text-white font-bold uppercase rounded-xl hover:bg-green-700 transition m-4">
        {/* Ikon check */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        KONFIRMASI
      </button>
    </div>
  );
}
