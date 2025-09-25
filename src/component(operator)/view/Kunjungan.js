import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { Activity, Users, Pill, CalendarDays } from "lucide-react";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

// ===================== Utils =====================
const FILTERS = ["hari_ini", "minggu", "bulan", "satu_tahun", "semua"]; // ganti tiga_bulan -> satu_tahun

function parseMySQLDate(mysqlDateString) {
  if (!mysqlDateString || typeof mysqlDateString !== "string") return null;
  if (mysqlDateString.includes("T")) return new Date(mysqlDateString);
  const [datePart, timePart] = mysqlDateString.split(" ");
  if (!datePart || !timePart) return null;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

function formatDateYMD(dateString) {
  const d = parseMySQLDate(dateString);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function getRangeForFilter(chartFilter) {
  const now = new Date();
  switch (chartFilter) {
    case "hari_ini": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "minggu": {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "bulan": {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "satu_tahun": {
      const start = new Date(now);
      start.setFullYear(now.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "semua":
    default:
      return null; // tanpa range
  }
}

function buildSeries(kunjungan, chartFilter) {
  if (!Array.isArray(kunjungan) || kunjungan.length === 0) return { unik: [], total: [] };
  const safe = kunjungan.filter((k) => parseMySQLDate(k.tanggal));
  const range = getRangeForFilter(chartFilter);

  const inRange = (k) => {
    if (!range) return true;
    const t = parseMySQLDate(k.tanggal);
    return t && t >= range.start && t <= range.end;
  };

  const src = safe.filter(inRange);

  const groupByDay = (data, unique = false) => {
    const map = {};
    data.forEach((k) => {
      const d = parseMySQLDate(k.tanggal);
      if (!d) return;
      const key = d.toDateString();
      if (!map[key]) map[key] = unique ? new Set() : [];
      unique ? map[key].add(k.id_siswa) : map[key].push(k);
    });
    return Object.keys(map)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((day) => ({ x: new Date(day), y: unique ? map[day].size : map[day].length }));
  };

  const groupByHour = (data, unique = false) => {
    const map = {};
    data.forEach((k) => {
      const d = parseMySQLDate(k.tanggal);
      if (!d) return;
      const h = d.getHours();
      if (!map[h]) map[h] = unique ? new Set() : [];
      unique ? map[h].add(k.id_siswa) : map[h].push(k);
    });
    return Object.keys(map)
      .sort((a, b) => a - b)
      .map((h) => {
        const d = new Date();
        d.setHours(Number(h), 0, 0, 0);
        return { x: d, y: unique ? map[h].size : map[h].length };
      });
  };

  const groupByMonth = (data, unique = false) => {
    const map = {};
    data.forEach((k) => {
      const d = parseMySQLDate(k.tanggal);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
      if (!map[key]) map[key] = unique ? new Set() : [];
      unique ? map[key].add(k.id_siswa) : map[key].push(k);
    });
    return Object.keys(map)
      .sort((a, b) => (a > b ? 1 : -1))
      .map((ym) => {
        const [y, m] = ym.split("-").map(Number);
        return { x: new Date(y, m - 1, 1), y: unique ? map[ym].size : map[ym].length };
      });
  };

  if (chartFilter === "hari_ini") {
    return { unik: groupByHour(src, true), total: groupByHour(src, false) };
  }
  if (chartFilter === "satu_tahun") {
    return { unik: groupByMonth(src, true), total: groupByMonth(src, false) };
  }
  if (chartFilter === "semua") {
    // grup per tahun untuk semua
    const map = {};
    safe.forEach((k) => {
      const d = parseMySQLDate(k.tanggal);
      if (!d) return;
      const y = d.getFullYear();
      if (!map[y]) map[y] = { uniq: new Set(), arr: [] };
      map[y].uniq.add(k.id_siswa);
      map[y].arr.push(k);
    });
    const years = Object.keys(map).sort((a, b) => a - b);
    return {
      unik: years.map((y) => ({ x: new Date(`${y}-01-01`), y: map[y].uniq.size })),
      total: years.map((y) => ({ x: new Date(`${y}-01-01`), y: map[y].arr.length })),
    };
  }

  // default: minggu / bulan → group per day
  return { unik: groupByDay(src, true), total: groupByDay(src, false) };
}

// ===================== UI Subcomponents =====================
function StatPill({ icon, label, value }) {
  return (
    <div className="px-4 py-2 rounded-xl bg-white/80 border border-green-100 shadow-sm flex items-center gap-2">
      <span className="text-green-700">{icon}</span>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-green-700/70">{label}</p>
        <p className="font-semibold text-green-800">{value}</p>
      </div>
    </div>
  );
}

function FilterBar({ kelas, setKelas, siswa, search, setSearch, chartFilter, setChartFilter }) {
  const kelasOptions = useMemo(
    () => ["semua", ...[...new Set(siswa.map((s) => s.kelas))].filter(Boolean)],
    [siswa]
  );

  const labelFor = (f) => f === "hari_ini" ? "Hari Ini" : f === "minggu" ? "1 Minggu" : f === "bulan" ? "1 Bulan" : f === "satu_tahun" ? "1 Tahun" : "Semua";

  return (
    <div className="sticky top-16 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-green-100 rounded-xl p-3 flex items-center gap-3 flex-wrap">
      <label className="text-sm text-green-900/80">
        <span className="mr-2">Kelas</span>
        <select
          aria-label="Filter kelas"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          className="border border-green-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {kelasOptions.map((kls) => (
            <option key={kls} value={kls}>{kls === "semua" ? "Semua" : kls}</option>
          ))}
        </select>
      </label>

      <input
        type="text"
        aria-label="Cari siswa"
        placeholder="Cari siswa…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-green-200 bg-white px-3 py-2 rounded-lg text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <div className="ml-auto flex gap-1 rounded-lg bg-green-100 p-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setChartFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm transition ${chartFilter === f ? "bg-green-600 text-white" : "text-green-800 hover:bg-green-200/70"
              }`}
          >
            {labelFor(f)}
          </button>
        ))}
      </div>
    </div>
  );
}

function StudentItem({ s, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl p-4 md:p-5 transition border flex items-start gap-3 group ${active
        ? "bg-white border-green-200 ring-1 ring-green-300 shadow-sm"
        : "bg-white/80 border-green-100 hover:bg-white hover:border-green-200 hover:shadow-md hover:-translate-y-[1px] duration-200"
        }`}
    >
      <div className="mt-1">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
          {s.nama?.[0] || "S"}
        </span>
      </div>
      <div className="flex-1 leading-relaxed">
        <h4 className="font-semibold text-green-900">{s.nama} <span className="text-sm text-green-800/70">{s.kelas}</span></h4>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
            <Activity size={12} /> {s.kunjunganCountFiltered} kunjungan
          </span>
          {s.kunjunganTerbaruFiltered ? (
            <span className="text-green-700/70">Terakhir: {s.kunjunganTerbaruFiltered.tanggal} ({s.kunjunganTerbaruFiltered.keluhan})</span>
          ) : (
            <span className="text-green-700/60 italic">Tidak ada pada rentang ini</span>
          )}
        </div>
      </div>
    </button>
  );
}

function DetailPanel({ selectedSiswa, tanggalAwal, setTanggalAwal }) {
  if (!selectedSiswa) {
    return <p className="text-green-800/60 italic">Pilih siswa di sebelah kiri untuk melihat detail kunjungan</p>;
  }
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-green-900">{selectedSiswa.nama}</h3>
          <p className="text-sm text-green-800/70">Kelas: {selectedSiswa.kelas}</p>
        </div>
        <input
          type="date"
          value={tanggalAwal}
          onChange={(e) => setTanggalAwal(e.target.value)}
          className="border border-green-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="max-h-60 min-h-60 overflow-y-auto pr-1 space-y-2">
        {(() => {
          const filtered = (selectedSiswa.kunjunganListFiltered || []).filter(
            (k) => !tanggalAwal || formatDateYMD(k.tanggal) === tanggalAwal
          );
          return filtered.length > 0 ? (
            filtered.map((k) => (
              <div key={k.id_kunjungan} className="p-3 border border-green-100 rounded-lg bg-green-50/50">
                <p className="text-sm"><span className="font-medium text-green-900">Tanggal:</span> {formatDateYMD(k.tanggal)}</p>
                <p className="text-sm"><span className="font-medium text-green-900">Keluhan:</span> {k.keluhan}</p>
                <p className="text-sm"><span className="font-medium text-green-900">Keterangan:</span> {k.keterangan}</p>
                <p className="text-sm"><span className="font-medium text-green-900">Obat:</span> {k.obat_dengan_qty}</p>
              </div>
            ))
          ) : (
            <p className="text-green-800/60 italic text-center mt-4">
              {tanggalAwal ? `Tanggal ${tanggalAwal} tidak ada datanya` : "Belum ada kunjungan"}
            </p>
          );
        })()}
      </div>

    </>
  );
}

function ChartCard({ data, options, chartFilter, setChartFilter }) {
  const labelFor = (f) => f === "hari_ini" ? "Hari Ini" : f === "minggu" ? "1 Minggu" : f === "bulan" ? "1 Bulan" : f === "satu_tahun" ? "1 Tahun" : "Semua";
  return (
    <div className="border border-green-100 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-green-900">Grafik Kunjungan</h3>
        <div className="flex gap-1 rounded-lg bg-green-100 p-1 md:hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setChartFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm transition ${chartFilter === f ? "bg-green-600 text-white" : "text-green-800 hover:bg-green-200/70"
                }`}
            >
              {labelFor(f)}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-[380px] md:h-[420px] p-2 md:p-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

// ===================== Main Component =====================
export default function Kunjungan() {
  const [siswa, setSiswa] = useState([]);
  const [kunjungan, setKunjungan] = useState([]);
  const [kelas, setKelas] = useState("semua");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSiswaId, setSelectedSiswaId] = useState(null);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [chartFilter, setChartFilter] = useState("hari_ini");

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa").then((res) => (res.ok ? res.json() : Promise.reject("Gagal memuat data siswa"))),
      fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=kunjungan").then((res) => (res.ok ? res.json() : Promise.reject("Gagal memuat data kunjungan"))),
    ])
      .then(([siswaData, kunjunganData]) => {
        setSiswa(Array.isArray(siswaData) ? siswaData : []);
        setKunjungan(Array.isArray(kunjunganData) ? kunjunganData : []);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ===== Stats =====
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const today = kunjungan.filter((k) => {
      const d = parseMySQLDate(k.tanggal);
      return d && d.toDateString() === todayStr;
    });
    const uniqueToday = new Set(today.map((k) => k.id_siswa)).size;
    return [
      { icon: <Users className="h-5 w-5" />, label: "Siswa yang Berkunjung Hari Ini", value: uniqueToday },
      { icon: <Activity className="h-5 w-5" />, label: "Total Kunjungan Hari Ini", value: today.length },
    ];
  }, [kunjungan]);

  // ===== Grouped siswa + kunjungan terbaru (sesuai filter) =====
  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const range = getRangeForFilter(chartFilter);
    const inRange = (k) => {
      if (!range) return true;
      const t = parseMySQLDate(k.tanggal);
      return t && t >= range.start && t <= range.end;
    };

    return siswa
      .filter((s) => (kelas === "semua" || s.kelas === kelas) && (s.nama || "").toLowerCase().includes(q))
      .map((s) => {
        const kunjunganList = kunjungan.filter((k) => k.id_siswa === s.id);
        const filteredList = kunjunganList.filter(inRange);
        const kunjunganTerbaruFiltered = filteredList.length ? filteredList[filteredList.length - 1] : null;
        return {
          ...s,
          kunjunganList,
          kunjunganListFiltered: filteredList,
          kunjunganCountFiltered: filteredList.length,
          kunjunganTerbaruFiltered,
        };
      });
  }, [siswa, kunjungan, kelas, search, chartFilter]);

  const selectedSiswa = useMemo(
    () => grouped.find(s => s.id === selectedSiswaId) || null,
    [grouped, selectedSiswaId]
  );

  // ===== Chart data & options (Green theme) =====
  const { chartData, chartOptions } = useMemo(() => {
    const series = buildSeries(kunjungan, chartFilter);
    return {
      chartData: {
        datasets: [
          {
            label: "Total Siswa Yang Berkunjung",
            data: series.unik,
            borderColor: "#16a34a",
            backgroundColor: "rgba(22,163,74,0.18)",
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: "Total Kunjungan",
            data: series.total,
            borderColor: "#14532d",
            backgroundColor: "rgba(20,83,45,0.12)",
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", axis: "x", intersect: false },
        plugins: {
          legend: { display: true, labels: { color: "#0a0f0a" } },
          tooltip: {
            callbacks: {
              title: (t) => {
                const xValue = t[0].raw?.x || t[0].parsed.x;
                const d = new Date(xValue);
                if (isNaN(d)) return "";
                if (chartFilter === "hari_ini") return `Jam: ${String(d.getHours()).padStart(2, "0")}:00`;
                if (chartFilter === "satu_tahun") return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
                if (chartFilter === "semua") return d.getFullYear();
                return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
              },
              label: (ti) => `${ti.dataset.label}: ${ti.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit:
                chartFilter === "hari_ini" ? "hour" :
                  chartFilter === "satu_tahun" ? "month" :
                    chartFilter === "semua" ? "year" :
                      "day",
              displayFormats: {
                hour: "HH:mm",
                day: "dd MMM",
                month: "MMM yyyy",
                year: "yyyy",
              },
            },
            grid: { color: "#e8f5e9" },
            ticks: { color: "#065f46" },
            title: {
              display: true,
              text:
                chartFilter === "hari_ini" ? `Hari Ini (${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })})` :
                  chartFilter === "satu_tahun" ? "Bulan" :
                    chartFilter === "semua" ? "Tahun" :
                      "Tanggal",
              color: "#065f46",
            },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: "#065f46" },
            grid: { color: "#e8f5e9" },
            title: { display: true, text: "Jumlah Kunjungan", color: "#065f46" },
          },
        },
      },
    };
  }, [kunjungan, chartFilter]);

  return (
    <div className="space-y-6 rounded-2xl p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-green-900 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow-sm"><Users size={16} /></span>
            Data Kunjungan UKS
          </h2>
          <p className="text-sm text-green-800/70">Pantau kunjungan berdasarkan siswa, kelas, dan waktu</p>
        </div>
        <div className="hidden md:flex gap-3">
          {stats.map((s, i) => (
            <StatPill key={i} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      <FilterBar
        kelas={kelas}
        setKelas={setKelas}
        siswa={siswa}
        search={search}
        setSearch={setSearch}
        chartFilter={chartFilter}
        setChartFilter={setChartFilter}
      />

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-green-100/40 border border-green-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div role="alert" className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAll} className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm">Coba Lagi</button>
        </div>
      )}

      {/* List & Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* List siswa */}
        <div className="space-y-3">
          <div className="max-h-[420px] overflow-y-auto pr-1 [scrollbar-gutter:stable]">
            {grouped.map((s) => (
              <StudentItem
                key={s.id}
                s={s}
                active={selectedSiswaId === s.id}
                onClick={() => {
                  setSelectedSiswaId(s.id);
                  if (window.innerWidth < 768) setModalOpen(true);
                }}
              />

            ))}
            {grouped.length === 0 && !loading && (
              <p className="text-green-800/60 italic">Tidak ada data sesuai filter.</p>
            )}
          </div>
        </div>

        {/* Detail siswa */}
        <div className="hidden md:block border border-green-100 rounded-xl p-4 bg-white shadow-sm min-h-[220px] max-h-[420px] overflow-y-auto">
          <DetailPanel selectedSiswa={selectedSiswa} tanggalAwal={tanggalAwal} setTanggalAwal={setTanggalAwal} />
        </div>
      </div>

      <ChartCard data={chartData} options={chartOptions} chartFilter={chartFilter} setChartFilter={setChartFilter} />

      {/* Modal detail (mobile) */}
      {modalOpen && selectedSiswa && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  {selectedSiswa.nama}
                </h3>
                <p className="text-sm text-green-800/70">
                  Kelas: {selectedSiswa.kelas}
                </p>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg bg-green-100 text-green-900"
                onClick={() => setModalOpen(false)}
              >
                Tutup
              </button>
            </div>

            <div className="space-y-2">
              {(selectedSiswa.kunjunganListFiltered || []).length === 0 ? (
                <p className="text-green-800/60 italic">
                  Tidak ada kunjungan pada rentang ini
                </p>
              ) : (
                selectedSiswa.kunjunganListFiltered.map((k) => (
                  <div
                    key={k.id_kunjungan}
                    className="p-3 border border-green-100 rounded-lg bg-green-50/50"
                  >
                    <p className="text-sm">
                      <span className="font-medium text-green-900">Tanggal:</span>{" "}
                      {formatDateYMD(k.tanggal)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-green-900">Keluhan:</span>{" "}
                      {k.keluhan}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-green-900">Keterangan:</span>{" "}
                      {k.keterangan}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-green-900">Obat:</span>{" "}
                      {k.obat_dengan_qty}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
