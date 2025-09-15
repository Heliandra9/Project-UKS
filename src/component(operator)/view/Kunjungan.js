import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { Line } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

// 🔹 Fungsi aman parse tanggal MySQL
function parseMySQLDate(mysqlDateString) {
  if (!mysqlDateString || typeof mysqlDateString !== "string") {
    return null; // skip jika null/undefined
  }

  // Kalau sudah ISO (ada "T"), langsung parse
  if (mysqlDateString.includes("T")) {
    return new Date(mysqlDateString);
  }

  // Format MySQL: "2025-09-10 08:00:00"
  const [datePart, timePart] = mysqlDateString.split(" ");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}

export default function Kunjungan() {
  const [siswa, setSiswa] = useState([]);
  const [kunjungan, setKunjungan] = useState([]);
  const [kelas, setKelas] = useState("semua");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [chartFilter, setChartFilter] = useState("hari_ini");

  const formatDate = (dateString) => {
    const d = parseMySQLDate(dateString);
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then(res => res.ok ? res.json() : Promise.reject("Gagal fetch siswa"))
      .then(data => setSiswa(data))
      .catch(err => setError(err));

    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=kunjungan")
      .then(res => res.ok ? res.json() : Promise.reject("Gagal fetch kunjungan"))
      .then(data => setKunjungan(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const grouped = siswa
    .filter(
      s => (kelas === "semua" || s.kelas === kelas) &&
        (s.nama || "").toLowerCase().includes(search.toLowerCase())
    )
    .map(s => {
      const kunjunganList = kunjungan.filter(k => k.id_siswa === s.id);
      const kunjunganTerbaru = kunjunganList.length > 0 ? kunjunganList[kunjunganList.length - 1] : null;
      return { ...s, kunjunganList, kunjunganTerbaru };
    });

  // 🔹 Chart data generator
  const getChartData = () => {
    if (!kunjungan || kunjungan.length === 0) return { unik: [], total: [] };

    const now = new Date();
    const safeKunjungan = kunjungan.filter(k => parseMySQLDate(k.tanggal));

    const filterByDate = (start, end) =>
      safeKunjungan.filter(k => {
        const t = parseMySQLDate(k.tanggal);
        return t && t >= start && t <= end;
      });

    const groupByDay = (data, unique = false) => {
      const map = {};
      data.forEach(k => {
        const d = parseMySQLDate(k.tanggal);
        if (!d) return;
        const day = d.toDateString();
        if (!map[day]) map[day] = unique ? new Set() : [];
        unique ? map[day].add(k.id_siswa) : map[day].push(k);
      });
      return Object.keys(map)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(day => ({
          x: new Date(day),
          y: unique ? map[day].size : map[day].length,
        }));
    };

    const groupByHour = (data, unique = false) => {
      const map = {};
      data.forEach(k => {
        const d = parseMySQLDate(k.tanggal);
        if (!d) return;
        const hour = d.getHours();
        if (!map[hour]) map[hour] = unique ? new Set() : [];
        unique ? map[hour].add(k.id_siswa) : map[hour].push(k);
      });
      return Object.keys(map)
        .sort((a, b) => a - b)
        .map(h => {
          const d = new Date();
          d.setHours(Number(h), 0, 0, 0);
          return { x: d, y: unique ? map[h].size : map[h].length };
        });
    };

    const groupByYear = (data, unique = false) => {
      const map = {};
      data.forEach(k => {
        const d = parseMySQLDate(k.tanggal);
        if (!d) return;
        const year = d.getFullYear();
        if (!map[year]) map[year] = unique ? new Set() : [];
        unique ? map[year].add(k.id_siswa) : map[year].push(k);
      });
      return Object.keys(map)
        .sort((a, b) => a - b)
        .map(year => ({
          x: new Date(`${year}-01-01`),
          y: unique ? map[year].size : map[year].length,
        }));
    };

    switch (chartFilter) {
      case "hari_ini": {
        const todayData = safeKunjungan.filter(k => {
          const t = parseMySQLDate(k.tanggal);
          return t && t.toDateString() === now.toDateString();
        });
        return {
          unik: groupByHour(todayData, true),
          total: groupByHour(todayData, false),
        };
      }
      case "minggu": {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 6);
        return {
          unik: groupByDay(filterByDate(weekAgo, now), true),
          total: groupByDay(filterByDate(weekAgo, now), false),
        };
      }
      case "bulan": {
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 29);
        return {
          unik: groupByDay(filterByDate(monthAgo, now), true),
          total: groupByDay(filterByDate(monthAgo, now), false),
        };
      }
      case "tiga_bulan": {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 2);
        return {
          unik: groupByDay(filterByDate(threeMonthsAgo, now), true),
          total: groupByDay(filterByDate(threeMonthsAgo, now), false),
        };
      }
      case "semua": {
        return {
          unik: groupByYear(safeKunjungan, true),
          total: groupByYear(safeKunjungan, false),
        };
      }
      default:
        return { unik: [], total: [] };
    }
  };

  const chartData = {
    datasets: [
      {
        label: "Total Siswa Yang Berkunjung",
        data: getChartData().unik,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Total Kunjungan",
        data: getChartData().total,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // ⬅️ ini penting biar width 100% ikut parent div
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const xValue = tooltipItems[0].raw?.x || tooltipItems[0].parsed.x;
            const d = new Date(xValue);
            if (isNaN(d)) return '';
            return chartFilter === 'hari_ini'
              ? `Jam: ${d.getHours().toString().padStart(2, '0')}:00`
              : `Tanggal: ${d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
          },
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: chartFilter === 'hari_ini' ? 'hour' : 'day',
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd MMM',
          },
        },
        title: {
          display: true,
          text:
            chartFilter === 'hari_ini'
              ? `Hari Ini (${new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })})`
              : 'Tanggal',
        },
        ticks: { source: 'data' },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Jumlah Kunjungan' },
      },
    },
  };


  const handleSiswaClick = (s) => {
    setSelectedSiswa(s);
    if (window.innerWidth < 768) setModalOpen(true);
  };



  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Data Kunjungan</h2>

      {loading && <p className="text-gray-500">Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Filter */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="semua">Semua Kelas</option>
          {[...new Set(siswa.map(s => s.kelas))].map(kls => (
            <option key={kls} value={kls}>{kls}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cari siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
      </div>

      {/* List Siswa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {grouped.map(s => (
            <div
              key={s.id}
              onClick={() => handleSiswaClick(s)}
              className={`border rounded-xl p-4 shadow-sm cursor-pointer ${selectedSiswa?.id === s.id ? "bg-green-50 border-green-400" : "bg-gray-50"}`}
            >
              <h4 className="font-semibold text-green-700">{s.nama}</h4>
              <p className="text-sm text-gray-600">Kelas: {s.kelas}</p>
              {s.kunjunganTerbaru ? (
                <p className="text-sm text-gray-500">
                  Terakhir: {s.kunjunganTerbaru.tanggal} ({s.kunjunganTerbaru.keluhan})
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada kunjungan</p>
              )}
            </div>
          ))}
        </div>

        {/* Detail Siswa */}
        <div className="hidden md:block border rounded-xl p-4 bg-white shadow-sm min-h-[200px] max-h-[400px] overflow-y-auto">
          {selectedSiswa ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl font-bold text-green-700">{selectedSiswa.nama}</h3>
                  <p className="text-sm text-gray-600">Kelas: {selectedSiswa.kelas}</p>
                </div>
                <input
                  type="date"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                  className="border p-1 rounded text-sm"
                />
              </div>
              <div className="max-h-60 min-h-60 overflow-y-auto">
                {(() => {
                  const filtered = selectedSiswa.kunjunganList.filter(
                    (k) => !tanggalAwal || formatDate(k.tanggal) === tanggalAwal
                  );
                  return filtered.length > 0 ? (
                    filtered.map((k) => (
                      <div
                        key={k.id_kunjungan}
                        className="p-3 border rounded-lg bg-gray-50 mb-2"
                      >
                        <p className="text-sm">
                          <span className="font-semibold">Tanggal:</span>{" "}
                          {formatDate(k.tanggal)}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Keluhan:</span> {k.keluhan}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Keterangan:</span>{" "}
                          {k.keterangan}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Obat:</span>{" "}
                          {k.obat_dengan_qty}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-center mt-4">
                      {tanggalAwal
                        ? `Tanggal ${tanggalAwal} tidak ada datanya`
                        : "Belum ada kunjungan"}
                    </p>
                  );
                })()}
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic">
              Pilih siswa di sebelah kiri untuk melihat detail kunjungan
            </p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-bold text-green-700">Grafik Kunjungan</h3>
          <div className="flex gap-2 flex-wrap">
            {["hari_ini", "minggu", "bulan", "tiga_bulan", "semua"].map(f => (
              <button
                key={f}
                onClick={() => setChartFilter(f)}
                className={`px-3 py-1 rounded ${chartFilter === f ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {f === "hari_ini" ? "Hari Ini" : f === "minggu" ? "1 Minggu" : f === "bulan" ? "1 Bulan" : f === "tiga_bulan" ? "3 Bulan" : "Semua"}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full h-[400px] p-6">
          <Line data={chartData} options={chartOptions} />
        </div>

      </div>
    </div>
  );
}
