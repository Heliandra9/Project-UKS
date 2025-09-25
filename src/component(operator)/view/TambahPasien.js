import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function TambahPasien() {
  const [obat, setObat] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [kelas, setKelas] = useState("");
  const [idSiswa, setIdSiswa] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cetakSurat, setCetakSurat] = useState("tidak");

  const userType = localStorage.getItem("tipe_user");
  const navigate = useNavigate();

  // ---------- Auth guard (tetap seperti sebelumnya) ----------
  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      navigate("/");
      return;
    }
    if (localStorage.getItem("showLoginSuccess") === "true") {
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang ${localStorage.getItem("username")}`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        localStorage.removeItem("showLoginSuccess");
      });
    }
    switch (userType) {
      case "operator":
        break;
      case "admin":
        navigate("/admin");
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Halaman ini hanya untuk operator.",
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
  }, [navigate, userType]);

  // ---------- Fetch data ----------
  useEffect(() => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=obat")
      .then((res) => res.json())
      .then((data) => setObat(Array.isArray(data) ? data : []));

    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then((res) => res.json())
      .then((data) => setSiswa(Array.isArray(data) ? data : []));
  }, []);

  // ---------- Derived data ----------
  const filteredObat = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return obat.filter((o) => (o.nama_obat || "").toLowerCase().includes(q));
  }, [obat, searchTerm]);

  const filteredSiswa = useMemo(() => {
    if (!kelas) return [];
    return siswa.filter((s) => s.kelas === kelas);
  }, [siswa, kelas]);

  // ---------- Helpers ----------
  const parseStok = (stockStr = "0 pcs") => {
    const parts = String(stockStr).split(" ");
    const jumlah = parseInt(parts[0], 10) || 0;
    const satuan = (parts[1] || "pcs").toLowerCase();
    return { jumlah, satuan };
  };

  const stepForUnit = (satuan) => (satuan === "ml" ? 5 : 1);

  // Tambah obat ke transaksi (atau increment kuantitas)
  const tambahTransaksi = (obatItem) => {
    setTransaksi((prev) => {
      const idx = prev.findIndex((it) => String(it.obat.id) === String(obatItem.id));
      const { jumlah: stok, satuan } = parseStok(obatItem.stock_dengan_satuan);
      const inc = stepForUnit(satuan);

      if (idx !== -1) {
        const item = prev[idx];
        const currentQty = quantities[item.obat.id] ?? item.qty;
        if (currentQty + inc > stok) {
          Swal.fire({ icon: "error", title: "Stok tidak cukup", timer: 1400, showConfirmButton: false });
          return prev;
        }
        const update = [...prev];
        update[idx] = { ...item, qty: currentQty + inc };
        setQuantities((q) => ({ ...q, [item.obat.id]: currentQty + inc }));
        return update;
      }

      if (stok < inc) {
        Swal.fire({ icon: "error", title: "Stok habis", timer: 1400, showConfirmButton: false });
        return prev;
      }
      setQuantities((q) => ({ ...q, [obatItem.id]: inc }));
      return [...prev, { obat: obatItem, qty: inc }];
    });
  };

  const updateQuantity = (id, qty) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(qty, 0) }));
    setTransaksi((prev) =>
      prev
        .map((item) => (String(item.obat.id) === String(id) ? { ...item, qty: Math.max(qty, 0) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const clearForm = () => {
    setKelas("");
    setIdSiswa("");
    setKeluhan("");
    setTransaksi([]);
    setQuantities({});
    setSearchTerm("");
  };

  const handleSimpan = () => {
    if (!kelas || !idSiswa || !keluhan.trim() || transaksi.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Kelas, siswa, keluhan, dan resep obat wajib diisi.",
        showConfirmButton: true,
      });
      return;
    }

    const dataPasien = {
      kelas,
      id_siswa: idSiswa,
      keluhan,
      obat: JSON.stringify(
        transaksi.map((item) => ({
          id_obat: item.obat.id,
          jumlah: item.qty,
        }))
      ),
      petugas: localStorage.getItem("username") || "operator",
      keterangan: "ditambahkan oleh operator",
    };

    fetch("http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=kunjungan", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(dataPasien).toString(),
    })
      .then((res) => res.text())
      .then((text) => {
        console.log("Raw response dari server:", text);
        let result;
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error("Response bukan JSON");
        }

        if (result.status === "success") {
          Swal.fire({ icon: "success", title: "Berhasil!", text: result.message, timer: 1500, showConfirmButton: false }).then(
            () => {
              // lebih halus daripada reload total
              clearForm();
            }
          );
        } else {
          Swal.fire({ icon: "error", title: "Gagal!", text: result.message || "Terjadi kesalahan", showConfirmButton: true });
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  // ---------- UI ----------
  return (
    <>
      {/* Modal konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Konfirmasi Data Pasien</h2>

            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium text-neutral-700">Kelas:</span> {kelas || "-"}</p>
              <p><span className="font-medium text-neutral-700">Siswa:</span> {siswa.find((s) => String(s.id) === String(idSiswa))?.nama || "-"}</p>
              <p className="sm:col-span-2"><span className="font-medium text-neutral-700">Keluhan:</span> {keluhan || "-"}</p>
            </div>

            <div className="mb-4">
              <p className="font-medium text-neutral-900 mb-1">Resep Obat</p>
              <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                {transaksi.map((item) => {
                  const { satuan } = parseStok(item.obat.stock_dengan_satuan);
                  return (
                    <li key={item.obat.id}>
                      {item.obat.nama_obat} — {item.qty} {satuan}
                    </li>
                  );
                })}
              </ul>
              {transaksi.length === 0 && <p className="text-neutral-400 italic">Belum ada obat dipilih</p>}
            </div>

            <div className="mb-4">
              <p className="font-medium text-neutral-900">Cetak Surat Sakit?</p>
              <div className="flex gap-4 mt-2 text-sm">
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

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50">
                Batal
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleSimpan();
                  if (cetakSurat === "ya") {
                    const pemeriksa = encodeURIComponent(localStorage.getItem("username") || "-");
                    window.open(
                      `http://localhost/pkl/Project-UKS/backend/proses/cetak_surat.php?id_siswa=${idSiswa}&pemeriksa=${pemeriksa}`,
                      "_blank"
                    );
                  }
                }}
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======= KONTEN ======= */}
      <main className="flex-1 p-0 md:p-0 flex flex-col gap-6 overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Form Pasien */}
          <section className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 
                   flex flex-col gap-3 overflow-y-auto max-h-[380px]">
            <h2 className="font-semibold text-neutral-900">Form Pasien</h2>

            <label className="text-sm text-neutral-700">
              Kelas
              <select
                value={kelas}
                onChange={(e) => {
                  setKelas(e.target.value);
                  setIdSiswa("");
                }}
                className="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">-- Pilih Kelas --</option>
                {[...new Set(siswa.map((s) => s.kelas))].map((k, idx) => (
                  <option key={idx} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-neutral-700">
              Siswa
              <select
                value={idSiswa}
                onChange={(e) => setIdSiswa(e.target.value)}
                className="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
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
                      <option key={s.id} value={s.id}>
                        {s.nama}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </label>

            <label className="text-sm text-neutral-700">
              Keluhan
              <textarea
                rows={4}
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Keluhan pasien…"
                className="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              />
            </label>
          </section>

          {/* List Obat */}
          <section className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 
                   flex flex-col overflow-hidden max-h-[380px]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-semibold text-neutral-900">List Obat</h2>
              <div className="flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Cari obat…"
                  className="w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-auto">
              {filteredObat.length ? (
                filteredObat.map((o) => {
                  const { satuan } = parseStok(o.stock_dengan_satuan);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => tambahTransaksi(o)}
                      className="text-left border border-neutral-200 rounded-2xl p-3 bg-neutral-50 hover:bg-neutral-100 hover:shadow-sm transition"
                    >
                      <img
                        src={`/logo/${o.gambar}`}
                        alt={o.nama_obat}
                        className="w-full h-20 object-cover rounded-md mb-2"
                      />
                      <p className="font-medium text-neutral-900 text-sm line-clamp-2">{o.nama_obat}</p>
                      <p className="text-xs text-neutral-500 mt-1">Stok: {o.stock_dengan_satuan}</p>
                      <p className="text-[11px] mt-1 text-green-700">Klik untuk tambah (+{stepForUnit(satuan)})</p>
                    </button>
                  );
                })
              ) : (
                <p className="col-span-full text-center text-neutral-400">Obat tidak ditemukan</p>
              )}
            </div>
          </section>
        </div>

        {/* Resep (desktop) */}
        <section className="hidden lg:flex bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 flex-col gap-3 h-44">
          <h2 className="font-semibold text-neutral-900">Resep Diberikan</h2>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {transaksi.length ? (
              transaksi.map((item) => {
                const { jumlah: stok, satuan } = parseStok(item.obat.stock_dengan_satuan);
                const currentQty = quantities[item.obat.id] ?? item.qty;
                const step = stepForUnit(satuan);
                return (
                  <div
                    key={item.obat.id}
                    className="min-w-[180px] bg-neutral-50 rounded-2xl p-3 border border-neutral-200"
                  >
                    <p className="font-medium text-neutral-900 text-sm line-clamp-2">{item.obat.nama_obat}</p>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => updateQuantity(item.obat.id, Math.max(currentQty - step, 0))}
                        className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100"
                        aria-label="Kurangi"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-neutral-900">
                        {currentQty} {satuan}
                      </span>
                      <button
                        onClick={() => {
                          if (currentQty + step > stok) {
                            Swal.fire({ icon: "error", title: "Stok tidak cukup", timer: 1400, showConfirmButton: false });
                            return;
                          }
                          updateQuantity(item.obat.id, currentQty + step);
                        }}
                        className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100"
                        aria-label="Tambah"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">Stok: {stok} {satuan}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-neutral-400">Belum ada obat dipilih</p>
            )}
          </div>
        </section>

        {/* Tombol Konfirmasi (desktop) */}
        <div className="hidden lg:flex">
          <button
            onClick={() => {
              if (!kelas || !idSiswa || !keluhan.trim() || transaksi.length === 0) {
                Swal.fire({
                  icon: "warning",
                  title: "Data belum lengkap!",
                  text: "Isi kelas, siswa, keluhan, dan resep obat terlebih dahulu.",
                });
              } else {
                setShowModal(true);
              }
            }}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Konfirmasi
          </button>
        </div>

        {/* ======= Layout Mobile ======= */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* Form Pasien */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-3">
            <h2 className="font-semibold text-neutral-900">Form Pasien</h2>

            <label className="text-sm text-neutral-700">
              Kelas
              <select
                value={kelas}
                onChange={(e) => {
                  setKelas(e.target.value);
                  setIdSiswa("");
                }}
                className="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">-- Pilih Kelas --</option>
                {[...new Set(siswa.map((s) => s.kelas))].map((k, idx) => (
                  <option key={idx} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-neutral-700">
              Siswa
              <select
                value={idSiswa}
                onChange={(e) => setIdSiswa(e.target.value)}
                className="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
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
                      <option key={s.id} value={s.id}>
                        {s.nama}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </label>

            <label className="text-sm text-neutral-700">
              Keluhan
              <textarea
                rows={4}
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Keluhan pasien…"
                className="mt-1 w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              />
            </label>
          </section>

          {/* List Obat */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
            <h2 className="font-semibold text-neutral-900 mb-2">List Obat</h2>
            <input
              type="text"
              placeholder="Cari obat…"
              className="w-full border border-neutral-300 bg-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {filteredObat.length ? (
                filteredObat.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => tambahTransaksi(o)}
                    className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition text-left"
                  >
                    <img src={`/logo/${o.gambar}`} alt={o.nama_obat} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{o.nama_obat}</p>
                      <p className="text-xs text-neutral-500">Stok: {o.stock_dengan_satuan}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-neutral-400">Obat tidak ditemukan</p>
              )}
            </div>
          </section>

          {/* Resep Mobile */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200">
            <h2 className="font-semibold text-neutral-900 mb-2">Resep Diberikan</h2>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {transaksi.length ? (
                transaksi.map((item) => {
                  const { jumlah: stok, satuan } = parseStok(item.obat.stock_dengan_satuan);
                  const currentQty = quantities[item.obat.id] ?? item.qty;
                  const step = stepForUnit(satuan);
                  return (
                    <div key={item.obat.id} className="flex items-center justify-between bg-neutral-50 rounded-xl p-2 border border-neutral-200">
                      <span className="text-sm font-medium text-neutral-900 mr-2 line-clamp-1">{item.obat.nama_obat}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.obat.id, Math.max(currentQty - step, 0))}
                          className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100"
                          aria-label="Kurangi"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold text-neutral-900">{currentQty}{satuan}</span>
                        <button
                          onClick={() => {
                            if (currentQty + step > stok) {
                              Swal.fire({ icon: "error", title: "Stok tidak cukup", timer: 1400, showConfirmButton: false });
                              return;
                            }
                            updateQuantity(item.obat.id, currentQty + step);
                          }}
                          className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100"
                          aria-label="Tambah"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-neutral-400">Belum ada obat dipilih</p>
              )}
            </div>
          </section>

          {/* Konfirmasi sticky (mobile) */}
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur border-t border-neutral-200 shadow-sm">
            <button
              onClick={() => {
                if (!kelas || !idSiswa || !keluhan.trim() || transaksi.length === 0) {
                  Swal.fire({
                    icon: "warning",
                    title: "Data belum lengkap!",
                    text: "Isi kelas, siswa, keluhan, dan resep obat terlebih dahulu.",
                  });
                } else {
                  setShowModal(true);
                }
              }}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
