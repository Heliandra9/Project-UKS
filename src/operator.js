import React, { useState, useEffect } from "react";
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
  const [showModal, setShowModal] = useState(false);
  const [cetakSurat, setCetakSurat] = useState("tidak"); // default


  const navigate = useNavigate();
  const userType = localStorage.getItem("tipe_user");

  const toggleLogout = () => setShowLogout(!showLogout);

  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate('/');
      return;
    }

    if (userType === "operator") return;

    if (userType === "admin") {
      navigate('/admin');
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Halaman ini hanya untuk operator.',
      });
      return;
    }

    navigate('/');
    Swal.fire({
      icon: 'error',
      title: 'Akses Ditolak',
      text: 'Anda tidak memiliki akses ke halaman ini.',
    });
  }, [navigate, userType]);

  const logot = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=obat")
      .then((res) => res.json())
      .then((data) => setObat(data))
      .catch((err) => console.error("Gagal ambil data obat:", err));

    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa")
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

  const handleTambahPasien = () => {
    if (!kelas || !idSiswa || !keluhan.trim() || transaksi.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Semua data pasien dan resep wajib diisi.",
        showConfirmButton: true
      });
      return;
    }

    const dataPasien = {
      kelas,
      id_siswa: idSiswa,
      keluhan,
      obat: JSON.stringify(
        transaksi.map(item => ({
          id_obat: item.obat.id,
          jumlah: item.qty
        }))
      ),
      keterangan: "ditambahkan oleh operator"
    };

    fetch("http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=kunjungan", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(dataPasien).toString()
    })
      .then(res => res.text())
      .then(text => {
        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          throw new Error("Response bukan JSON");
        }

        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: result.message,
            timer: 1500,
            showConfirmButton: false
          })
            .then(() => {
              window.location.reload();
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: result.message || "Terjadi kesalahan",
            showConfirmButton: true
          });
        }
      })
      .catch(err => console.error("Fetch error:", err))
  };

  return (
    <div className="flex flex-col lg:h-screen bg-gradient-to-br from-green-300 via-green-100 to-green-500 pb-24 lg:pb-0">
      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-lg font-bold text-green-700 mb-4">Konfirmasi Data Pasien</h2>

            {/* Detail Pasien */}
            <div className="mb-3">
              <p><span className="font-semibold">Kelas:</span> {kelas}</p>
              <p><span className="font-semibold">Siswa:</span> {siswa.find(s => s.id === idSiswa)?.nama || "-"}</p>
              <p><span className="font-semibold">Keluhan:</span> {keluhan}</p>
            </div>

            {/* List Obat */}
            <div className="mb-3">
              <p className="font-semibold mb-1">Resep Obat:</p>
              <ul className="list-disc pl-5 text-sm">
                {transaksi.map((item) => (
                  <li key={item.obat.id}>
                    {item.obat.nama_obat} - {item.qty} {item.obat.stock_dengan_satuan.split(" ")[1]}
                  </li>
                ))}
              </ul>
            </div>

            {/* Radio Cetak Surat */}
            <div className="mb-4">
              <p className="font-semibold">Cetak Surat Sakit?</p>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cetakSurat"
                    value="ya"
                    checked={cetakSurat === "ya"}
                    onChange={(e) => setCetakSurat(e.target.value)}
                  />
                  Ya
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cetakSurat"
                    value="tidak"
                    checked={cetakSurat === "tidak"}
                    onChange={(e) => setCetakSurat(e.target.value)}
                  />
                  Tidak
                </label>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleTambahPasien();

                  if (cetakSurat === "ya") {
                    const pemeriksa = encodeURIComponent(localStorage.getItem("username") || "-");
                    // arahkan ke cetak surat sakit (Word/PDF)
                    window.open(`http://localhost/pkl/Project-UKS/backend/proses/cetak_surat.php?id_siswa=${idSiswa}&pemeriksa=${pemeriksa}`, "_blank");
                  }
                }}
                className="px-4 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Header */}
      <header className="sticky top-0 z-50 p-4 bg-green-500 text-white flex justify-between items-center flex-shrink-0 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">UKS Sekolah</h1>
        <div className="relative">
          <div
            onClick={toggleLogout}
            className="flex items-center gap-2 cursor-pointer hover:text-green-200 transition text-bold"
          >
            {localStorage.getItem("username")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${showLogout ? "rotate-180" : ""}`}
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
            <div className="absolute top-12 right-0 z-50 w-40">
              <button
                onClick={logot}
                className={`bg-red-500 cursor-pointer hover:opacity-50 w-full p-2 text-white font-semibold rounded-sm flex items-center justify-center gap-2`}
                type="button"
              >
                <i className="bi bi-box-arrow-right"></i> Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Konten */}
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">

        {/* ======= Layout Desktop ======= */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
          {/* Form Pasien */}
          <div className="lg:col-span-1 bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-rounded-xl border border-green-500 flex flex-col gap-3 overflow-auto">
            <h2 className="font-semibold text-lg text-green-700">Form Pasien</h2>
            <select
              value={kelas}
              onChange={(e) => {
                setKelas(e.target.value);
                setIdSiswa("");
              }}
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Pilih Kelas --</option>
              {[...new Set(siswa.map((s) => s.kelas))].map((k, idx) => (
                <option key={idx} value={k}>{k}</option>
              ))}
            </select>

            <select
              value={idSiswa}
              onChange={(e) => setIdSiswa(e.target.value)}
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400"
            >
              {!kelas ? (
                <>
                  <option value="">Pilih Siswa</option>
                  <option value="">Pilih kelas terlebih dahulu</option>
                </>
              ) : (
                <>
                  <option value="">Pilih Siswa</option>
                  {filteredSiswa.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama}</option>
                  ))}
                </>
              )}
            </select>

            <textarea
              rows={3}
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              placeholder="Keluhan pasien..."
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* List Obat */}
          <div className="lg:col-span-2 bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-rounded-xl border border-green-500 flex flex-col overflow-hidden">
            <h2 className="font-semibold text-lg text-green-700 mb-2">List Obat</h2>
            <input
              type="text"
              placeholder="Cari obat..."
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400 mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-auto">
              {filteredObat.length ? (
                filteredObat.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => tambahTransaksi(o)}
                    className="cursor-pointer border border-green-200 rounded-xl p-3 flex flex-col items-center hover:shadow-md hover:scale-[1.02] transition bg-white"
                  >
                    <img
                      src={`/logo/${o.gambar}`}
                      alt={o.nama_obat}
                      className="w-full h-16 object-cover rounded-md"
                    />
                    <p className="font-medium text-center text-green-800 text-sm truncate">{o.nama_obat}</p>
                    <p className="text-xs text-green-500">Stok: {o.stock_dengan_satuan}</p>
                  </div>
                ))
              ) : (
                <p className="col-span-4 text-center text-green-400">Obat tidak ditemukan</p>
              )}
            </div>
          </div>
        </div>

        {/* Resep */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-rounded-2xl border border-green-500 flex flex-col gap-3 h-40 flex-shrink-0">
          <h2 className="font-semibold text-lg text-green-700">Resep Diberikan</h2>
          <div className="flex gap-4 overflow-x-auto">
            {transaksi.length ? (
              transaksi.map((item) => {
                const parts = item.obat.stock_dengan_satuan.split(" ");
                const stok = parseInt(parts[0], 10);
                const satuan = parts[1];
                const currentQty = quantities[item.obat.id] || item.qty;

                return (
                  <div
                    key={item.obat.id}
                    className="min-w-[140px] bg-green-50 rounded-xl p-3 flex flex-col items-center border border-green-200 shadow"
                  >
                    <p className="font-medium text-green-800 text-center text-sm">{item.obat.nama_obat}</p>
                    <div className="flex justify-between items-center w-full mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.obat.id, currentQty - (satuan.toLowerCase() === "ml" ? 5 : 1))
                        }
                        className="bg-white border border-green-300 text-green-700 w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-100"
                      >
                        -
                      </button>
                      <span className="text-green-800 font-semibold text-sm">{currentQty} {satuan}</span>
                      <button
                        onClick={() => {
                          const step = satuan.toLowerCase() === "ml" ? 5 : 1;
                          const currentQty = quantities[item.obat.id] || item.qty;
                          if (currentQty + step > stok) {
                            Swal.fire({
                              icon: "error",
                              title: "Stok tidak cukup",
                              timer: 1500,
                              showConfirmButton: false,
                            });
                            return;
                          }
                          updateQuantity(item.obat.id, currentQty + step);
                        }}
                        className="bg-white border border-green-300 text-green-700 w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-green-500 mt-1">Stok: {stok} {satuan}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-green-400">Belum ada obat dipilih</p>
            )}
          </div>
        </div>

        {/* Konfirmasi */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-rounded-2xl border border-green-500 flex items-center justify-center flex-shrink-0">
          <button
            onClick={() => {
              if (!kelas || !idSiswa || !keluhan.trim() || transaksi.length === 0) {
                Swal.fire({
                  icon: "warning",
                  title: "Data pasien belum lengkap!",
                  text: "Silakan isi kelas, siswa, keluhan, dan resep obat terlebih dahulu.",
                });
              } else {
                setShowModal(true);
              }
            }
            }
            className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            KONFIRMASI
          </button>
        </div>



        {/* ======= Layout Mobile ======= */}
        <div className="lg:hidden flex flex-col gap-4">
          {/* Form Pasien */}
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-md border border-green-300 flex flex-col gap-3">
            <h2 className="font-semibold text-lg text-green-700">Form Pasien</h2>
            <select
              value={kelas}
              onChange={(e) => { setKelas(e.target.value); setIdSiswa(""); }}
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Pilih Kelas --</option>
              {[...new Set(siswa.map((s) => s.kelas))].map((k, idx) => (
                <option key={idx} value={k}>{k}</option>
              ))}
            </select>

            <select
              value={idSiswa}
              onChange={(e) => setIdSiswa(e.target.value)}
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400"
            >
              {!kelas ? (
                <>
                  <option value="">Pilih Siswa</option>
                  <option value="">Pilih kelas terlebih dahulu</option>
                </>
              ) : (
                <>
                  <option value="">Pilih Siswa</option>
                  {filteredSiswa.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama}</option>
                  ))}
                </>
              )}
            </select>

            <textarea
              rows={3}
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              placeholder="Keluhan pasien..."
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* List Obat */}
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 shadow-md border border-green-300 flex flex-col gap-3 h-100">
            <h2 className="font-semibold text-lg text-green-700 mb-2">List Obat</h2>
            <input
              type="text"
              placeholder="Cari obat..."
              className="border p-2 rounded-lg border-green-500 focus:ring-2 focus:ring-green-400 mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-y-auto flex flex-col gap-2">
              {filteredObat.map((o) => (
                <div
                  key={o.id}
                  onClick={() => tambahTransaksi(o)}
                  className="flex items-center gap-3 p-2 bg-white rounded-xl border border-green-200 shadow hover:scale-[1.02] transition cursor-pointer"
                >
                  <img
                    src={`/logo/${o.gambar}`}
                    alt={o.nama_obat}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-green-800 font-medium text-sm truncate">{o.nama_obat}</p>
                    <p className="text-xs text-green-500">Stok: {o.stock_dengan_satuan}</p>
                  </div>
                </div>
              ))}
              {filteredObat.length === 0 && (
                <p className="text-center text-green-400 mt-2">Obat tidak ditemukan</p>
              )}
            </div>
          </div>

          {/* Resep Vertical Scroll Mobile */}
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 shadow-md border border-green-300 overflow-y-auto max-h-60 flex flex-col gap-2">
            <h2 className="font-semibold text-lg text-green-700">Resep Diberikan</h2>
            {transaksi.length ? (
              transaksi.map((item) => {
                const parts = item.obat.stock_dengan_satuan.split(" ");
                const stok = parseInt(parts[0], 10);
                const satuan = parts[1];
                const currentQty = quantities[item.obat.id] || item.qty;

                return (
                  <div
                    key={item.obat.id}
                    className="flex justify-between items-center bg-green-50 rounded-xl p-2 border border-green-200 shadow"
                  >
                    <div className="text-green-800 font-medium">{item.obat.nama_obat}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.obat.id, currentQty - (satuan.toLowerCase() === "ml" ? 5 : 1))
                        }
                        className="bg-white border border-green-300 text-green-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-100"
                      >
                        -
                      </button>
                      <span className="text-green-800 font-semibold">{currentQty}{satuan}</span>
                      <button
                        onClick={() => {
                          const step = satuan.toLowerCase() === "ml" ? 5 : 1;
                          const currentQty = quantities[item.obat.id] || item.qty;
                          if (currentQty + step > stok) {
                            Swal.fire({
                              icon: "error",
                              title: "Stok tidak cukup",
                              timer: 1500,
                              showConfirmButton: false,
                            });
                            return;
                          }
                          updateQuantity(item.obat.id, currentQty + step);
                        }}
                        className="bg-white border border-green-300 text-green-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-green-400 text-center">Belum ada obat dipilih</p>
            )}
          </div>

          {/* Konfirmasi Sticky di Bawah */}
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-md border-t border-green-300 shadow-md">
            <button
              onClick={() => {
                if (!kelas || !idSiswa || !keluhan.trim() || transaksi.length === 0) {
                  Swal.fire({
                    icon: "warning",
                    title: "Data pasien belum lengkap!",
                    text: "Silakan isi kelas, siswa, keluhan, dan resep obat terlebih dahulu.",
                  });
                } else {
                  setShowModal(true);
                }
              }
              }
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
            >
              KONFIRMASI
            </button>
          </div>
        </div>


      </main>
    </div>
  );
}
