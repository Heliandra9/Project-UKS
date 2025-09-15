import React, { useEffect, useState } from "react";
import Topbar from "./component(gudang)/Topbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Gudang() {
  const [obat, setObat] = useState([]);
  const [error, setError] = useState("");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [filterJenis, setFilterJenis] = useState("Masuk");
  const [showModal, setShowModal] = useState(false);
  const [newObat, setNewObat] = useState({ nama_obat: "", qty: "", satuan: "" });

  const fetchObat = async () => {
    try {
      const res = await fetch(
        "http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=transaksi_obat"
      );
      if (!res.ok) throw new Error("Gagal fetch obat");
      const data = await res.json();
      setObat(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchObat();
  }, []);

  // 🔹 Group data per bulan-tahun
  const groupedByMonth = obat.reduce((acc, item) => {
    const d = new Date(item.created_at);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(item);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedByMonth).sort();
  const activeMonthKey = monthKeys[currentMonthIndex] || null;
  const activeData = activeMonthKey ? groupedByMonth[activeMonthKey] : [];

  // 🔹 Tabel sesuai filterJenis
  const tabelData = activeData
    .filter((item) => filterJenis === "Semua" || item.jenis_transaksi === filterJenis)
    .slice(0, 10);

  // 🔹 Hitung total per hari
  const [activeYear, activeMonth] = activeMonthKey
    ? activeMonthKey.split("-").map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];

  const daysInMonth = new Date(activeYear, activeMonth, 0).getDate();
  const monthDate = new Date(activeYear, activeMonth - 1, 1);

  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const masukPerHari = {};
  const keluarPerHari = {};

  activeData.forEach((item) => {
    const d = new Date(item.created_at);
    if (d.getFullYear() === activeYear && d.getMonth() + 1 === activeMonth) {
      const day = d.getDate();
      if (item.jenis_transaksi === "Masuk") {
        masukPerHari[day] = (masukPerHari[day] || 0) + Number(item.qty);
      } else if (item.jenis_transaksi === "Keluar") {
        keluarPerHari[day] = (keluarPerHari[day] || 0) + Number(item.qty);
      }
    }
  });

  const totalMasuk = Object.values(masukPerHari).reduce((a, b) => a + b, 0);
  const totalKeluar = Object.values(keluarPerHari).reduce((a, b) => a + b, 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Obat Masuk",
        data: labels.map((d) => masukPerHari[d] || 0),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.4)",
      },
      {
        label: "Obat Keluar",
        data: labels.map((d) => keluarPerHari[d] || 0),
        borderColor: "rgba(239,68,68,1)",
        backgroundColor: "rgba(239,68,68,0.4)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: activeMonthKey
          ? `Statistik Obat (Periode: 1-${daysInMonth} ${monthDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})`
          : "Tidak ada data",
        font: { size: 16 },
      },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: { y: { beginAtZero: true } },
  };

  const handleTambahObat = async () => {
    if (!newObat.nama_obat || !newObat.qty || !newObat.satuan) {
      alert("Lengkapi semua field!");
      return;
    }

    const dataToSend = {
      nama_obat: newObat.nama_obat,
      qty: Number(newObat.qty),
      satuan: newObat.satuan,
    };

    try {
      const res = await fetch(
        "http://localhost/pkl/Project-UKS/backend/proses/tambah_obat.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("Obat berhasil ditambahkan!");
        setShowModal(false);
        setNewObat({ nama_obat: "", qty: "", satuan: "" });
        fetchObat(); // refresh data
      } else {
        alert("Gagal menambahkan obat");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menambahkan obat");
    }
  };

  return (
    <div className="space-y-4 bg-green-100 min-h-screen">
      {/* Modal Tambah Obat */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Tambah Obat Baru</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nama Obat"
                value={newObat.nama_obat}
                onChange={(e) =>
                  setNewObat({ ...newObat, nama_obat: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-300"
              />
              <input
                type="number"
                placeholder="Jumlah Obat"
                min={1}
                value={newObat.qty}
                onChange={(e) =>
                  setNewObat({ ...newObat, qty: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-300"
              />
              <select
                value={newObat.satuan}
                onChange={(e) =>
                  setNewObat({ ...newObat, satuan: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-300"
              >
                <option value="">Pilih Satuan</option>
                <option value="pcs">pcs</option>
                <option value="ml">ml</option>
              </select>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleTambahObat}
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      <Topbar />
      <main className="mx-auto pb-4 py-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-white rounded-xl p-4 shadow">
          <div>
            <h2 className="text-xl font-bold">Selamat Datang!</h2>
            <p className="text-sm opacity-90">Ini halaman kelola obat Anda</p>
          </div>
          <button
            className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-100 transition"
            onClick={() => setShowModal(true)}
          >
            Tambah Obat
          </button>
        </div>


        {/* Navigasi bulan */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentMonthIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentMonthIndex === 0}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            ←
          </button>
          <span className="font-semibold text-gray-700">
            {activeMonthKey
              ? monthDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
              : "-"}
          </span>
          <button
            onClick={() =>
              setCurrentMonthIndex((prev) =>
                Math.min(monthKeys.length - 1, prev + 1)
              )
            }
            disabled={currentMonthIndex === monthKeys.length - 1}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>

        {/* Chart */}
        <div
          className="bg-white rounded-xl shadow p-3"
          style={{ height: "250px" }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
        {/* Ringkasan Total Klikable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setFilterJenis("Masuk")}
            className={`cursor-pointer bg-white border rounded-xl shadow p-4 flex items-center justify-between transition ${filterJenis === "Masuk" ? "ring-2 ring-green-400" : ""
              }`}
          >
            <div>
              <p className="text-sm text-gray-500">Obat Masuk</p>
              <h3 className="text-xl font-bold text-green-600">
                {totalMasuk.toLocaleString()}
              </h3>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Masuk
            </span>
          </div>

          <div
            onClick={() => setFilterJenis("Keluar")}
            className={`cursor-pointer bg-white border rounded-xl shadow p-4 flex items-center justify-between transition ${filterJenis === "Keluar" ? "ring-2 ring-red-400" : ""
              }`}
          >
            <div>
              <p className="text-sm text-gray-500">Obat Keluar</p>
              <h3 className="text-xl font-bold text-red-600">
                {totalKeluar.toLocaleString()}
              </h3>
            </div>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              Keluar
            </span>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto rounded-xl shadow border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr
                className={
                  filterJenis === "Masuk"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                <th className="py-1 px-2 border-b">Tanggal</th>
                <th className="py-1 px-2 border-b">Nama Obat</th>
                <th className="py-1 px-2 border-b">Jumlah</th>
                <th className="py-1 px-2 border-b">Jenis</th>
                <th className="py-1 px-2 border-b">Keterangan</th>
                <th className="py-1 px-2 border-b">Petugas</th>
              </tr>
            </thead>
            <tbody>
              {tabelData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-3 text-gray-400">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                tabelData.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    <td className="py-1 px-2 border-b">
                      {new Date(a.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-1 px-2 border-b">{a.nama_obat}</td>
                    <td className="py-1 px-2 border-b">{a.qty} {a.satuan}</td>
                    <td
                      className={`py-1 px-2 border-b font-semibold ${a.jenis_transaksi === "Masuk"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {a.jenis_transaksi}
                    </td>
                    <td className="py-1 px-2 border-b">{a.keterangan || "-"}</td>
                    <td classNam  e="py-1 px-2 border-b">{a.petugas || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
