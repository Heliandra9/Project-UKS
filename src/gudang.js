// Gudang.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./component(gudang)/Sidebar";
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

/* -------- helpers -------- */
function safeDate(d) {
  if (!d) return null;
  try {
    if (d instanceof Date) return d;
    if (typeof d !== "string") return new Date(d);
    if (d.includes("T")) return new Date(d);
    const [datePart, timePart = "00:00:00"] = d.trim().split(" ");
    const dateParts = datePart.split("-").map((v) => Number(v));
    if (dateParts.length === 3) {
      const [y, m, dd] = dateParts;
      const [hh = 0, mm = 0, ss = 0] = (timePart || "00:00:00").split(":").map((v) => Number(v));
      return new Date(y, (m || 1) - 1, dd || 1, hh || 0, mm || 0, ss || 0);
    }
    return new Date(d);
  } catch {
    return new Date(d);
  }
}

const JENIS_OBAT_OPTIONS = ["pcs", "ml", "tablet", "kapsul", "strip", "botol", "tube", "sachet"];

function Badge({ children, tone = "default" }) {
  const map =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "warn"
      ? "bg-amber-100 text-amber-800"
      : tone === "muted"
      ? "bg-slate-50 text-slate-500"
      : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map}`}>
      {children}
    </span>
  );
}

function InitialsAvatar({ name = "-" }) {
  const ini = String(name || "-")
    .split(" ")
    .map((x) => (x ? x[0] : ""))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-semibold ring-1 ring-slate-200"
      aria-hidden
    >
      {ini || "?"}
    </div>
  );
}

/* -------- main component -------- */
export default function Gudang() {
  // default view & filter set to "masuk" per request
  const [view, setView] = useState("masuk"); // "dashboard" | "masuk" | "keluar"
  const [obat, setObat] = useState([]);
  const [error, setError] = useState("");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(null);
  const [filterJenis, setFilterJenis] = useState("Masuk"); // default "Masuk"
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newObat, setNewObat] = useState({
    nama_obat: "",
    kode_obat: "",
    kandungan: "",
    stock_obat: "",
    satuan: "",
    jenis_obat: "Tablet",
  });

  async function fetchObat() {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=transaksi_obat"
      );
      if (!res.ok) throw new Error("Gagal memuat data obat");
      const data = await res.json();
      setObat(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err?.message || String(err));
      setObat([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchObat();
  }, []);

  const groupedByMonth = useMemo(() => {
    return obat.reduce((acc, item) => {
      const d = safeDate(item.created_at);
      if (!d || isNaN(d)) return acc;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      (acc[key] ||= []).push(item);
      return acc;
    }, {});
  }, [obat]);

  const monthKeys = useMemo(() => {
    const keys = Object.keys(groupedByMonth).sort();
    return keys;
  }, [groupedByMonth]);

  useEffect(() => {
    if (monthKeys.length === 0) {
      setCurrentMonthIndex(null);
    } else {
      setCurrentMonthIndex((prev) => {
        if (prev === null) return monthKeys.length - 1;
        return Math.min(Math.max(0, prev), monthKeys.length - 1);
      });
    }
  }, [monthKeys]);

  const activeMonthKey = currentMonthIndex === null ? null : monthKeys[currentMonthIndex] || null;
  const activeData = activeMonthKey ? groupedByMonth[activeMonthKey] : [];

  const [activeYear, activeMonth] = activeMonthKey
    ? activeMonthKey.split("-").map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];

  const daysInMonth = new Date(activeYear, activeMonth, 0).getDate();
  const monthDate = new Date(activeYear, activeMonth - 1, 1);
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (view === "masuk") setFilterJenis("Masuk");
    else if (view === "keluar") setFilterJenis("Keluar");
    else setFilterJenis("Masuk"); // keep default as Masuk
  }, [view]);

  const { transaksiMasukPerHari, transaksiKeluarPerHari } = useMemo(() => {
    const masuk = {};
    const keluar = {};
    (activeData || []).forEach((item) => {
      const d = safeDate(item.created_at);
      if (!d || isNaN(d)) return;
      if (d.getFullYear() === activeYear && d.getMonth() + 1 === activeMonth) {
        const day = d.getDate();
        if (item.jenis_transaksi === "Masuk") masuk[day] = (masuk[day] || 0) + 1;
        else if (item.jenis_transaksi === "Keluar") keluar[day] = (keluar[day] || 0) + 1;
      }
    });
    return { transaksiMasukPerHari: masuk, transaksiKeluarPerHari: keluar };
  }, [activeData, activeYear, activeMonth]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Transaksi Masuk",
          data: labels.map((d) => transaksiMasukPerHari[d] || 0),
          borderColor: "rgba(22,163,74,1)",
          backgroundColor: "rgba(22,163,74,0.12)",
          tension: 0.35,
          pointRadius: 2,
        },
        {
          label: "Transaksi Keluar",
          data: labels.map((d) => transaksiKeluarPerHari[d] || 0),
          borderColor: "rgba(245,158,11,1)",
          backgroundColor: "rgba(245,158,11,0.12)",
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    };
  }, [labels, transaksiMasukPerHari, transaksiKeluarPerHari]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: activeMonthKey
            ? `Statistik Transaksi • ${monthDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`
            : "Tidak ada data",
          font: { size: 15 },
        },
        tooltip: {
          mode: "nearest",
          intersect: false,
          callbacks: { title: (items) => `Hari ${items[0]?.label}` },
        },
      },
      interaction: { mode: "nearest", axis: "x", intersect: false },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    };
  }, [activeMonthKey, monthDate]);

  const User = localStorage.getItem("username") || sessionStorage.getItem("username") || "Unknown";

  const handleTambahObat = async () => {
    const payload = {
      nama_obat: (newObat.nama_obat || "").trim(),
      kode_obat: (newObat.kode_obat || "").trim(),
      kandungan: (newObat.kandungan || "").trim(),
      stock_obat: String(Number(newObat.stock_obat) || 0),
      jenis_obat: (newObat.jenis_obat || "Tablet").trim(),
      satuan: (newObat.satuan || "").trim(),
      petugas: (User || "").trim(),
      keterangan: "Penambahan dari halaman gudang",
    };

    if (
      !payload.nama_obat ||
      !payload.kode_obat ||
      !payload.kandungan ||
      !payload.satuan ||
      !payload.jenis_obat ||
      Number(payload.stock_obat) <= 0
    ) {
      alert("Semua field wajib diisi. Jumlah harus > 0.");
      return;
    }

    try {
      const formBody = new URLSearchParams(payload);
      const res = await fetch(
        "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=obat",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: formBody.toString(),
        }
      );

      const raw = await res.text();
      let result;
      try {
        result = JSON.parse(raw);
      } catch {
        result = { status: res.ok ? "success" : "error", message: raw };
      }

      if (String(result.status).toLowerCase() === "success") {
        setShowModal(false);
        setNewObat({
          nama_obat: "",
          kode_obat: "",
          kandungan: "",
          stock_obat: "",
          satuan: "",
          jenis_obat: "Tablet",
        });
        fetchObat();
      } else {
        alert(result?.message || "Gagal menambahkan obat");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan obat");
    }
  };

  const filteredActiveData = (activeData || []).filter((item) => filterJenis === "Semua" || item.jenis_transaksi === filterJenis);
  const tabelData = filteredActiveData.slice(0, 12);

  function exportCSV() {
    const rows = [
      ["Tanggal", "Nama Obat", "Kode", "Jumlah", "Satuan", "Jenis", "Keterangan", "Petugas"],
      ...filteredActiveData.map((r) => {
        const sd = safeDate(r.created_at);
        const t = sd && !isNaN(sd) ? sd.toLocaleDateString("id-ID") : (r.created_at || "-");
        return [t, r.nama_obat || "-", r.kode_obat || "-", r.qty || "-", r.satuan || "-", r.jenis_transaksi || "-", r.keterangan || "-", r.petugas || "-"];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transaksi_obat_${activeMonthKey || "semua"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Sidebar view={view} setView={setView} />

      {/* Modal Tambah Obat */}
      {showModal && (
        <div className="fixed inset-0 z-50 md:pl-72">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="absolute inset-0 grid place-items-center px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-2xl">
              <div className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-slate-800">Tambah Obat Baru</h3>
                <p className="text-xs text-slate-500">Isi data obat baru untuk masuk ke gudang.</p>
              </div>

              <div className="px-6 pb-2">
                <div className="mt-4 grid gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Nama Obat</label>
                    <input
                      type="text"
                      value={newObat.nama_obat}
                      onChange={(e) => setNewObat((p) => ({ ...p, nama_obat: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                      placeholder="Contoh: Paracetamol"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Kode Obat</label>
                    <input
                      type="text"
                      value={newObat.kode_obat}
                      onChange={(e) => setNewObat((p) => ({ ...p, kode_obat: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                      placeholder="Contoh: OB-PRC-001"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Kandungan</label>
                    <textarea
                      rows={2}
                      value={newObat.kandungan}
                      onChange={(e) => setNewObat((p) => ({ ...p, kandungan: e.target.value }))}
                      className="w-full resize-y rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                      placeholder="Contoh: Paracetamol 500mg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Jenis Obat</label>
                    <select
                      value={newObat.jenis_obat}
                      onChange={(e) => setNewObat((p) => ({ ...p, jenis_obat: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Sirup">Sirup</option>
                      <option value="Kapsul">Kapsul</option>
                      <option value="Salep">Salep</option>
                      <option value="Tetes">Tetes</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Jumlah & Satuan</label>
                    <div className="flex rounded-xl border border-slate-300 bg-white/80 shadow-sm focus-within:ring-2 focus-within:ring-emerald-300 focus-within:border-emerald-300">
                      <input
                        type="number"
                        min={1}
                        value={newObat.stock_obat}
                        onChange={(e) => setNewObat((p) => ({ ...p, stock_obat: e.target.value.replace(/[^\d-]/g, "") }))}
                        className="w-full rounded-l-xl bg-transparent px-3 py-2 text-sm outline-none"
                        placeholder="Masukkan jumlah"
                      />
                      <select
                        value={newObat.satuan}
                        onChange={(e) => setNewObat((p) => ({ ...p, satuan: e.target.value }))}
                        className="rounded-r-xl border-l border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                      >
                        <option value="">Satuan</option>
                        {JENIS_OBAT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-4">
                <button className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={handleTambahObat}>
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Konten utama */}
      <div className="md:pl-72">
        <main className="mx-auto max-w-6xl px-4 pb-12 pt-5 space-y-6">
          {/* Header modern */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 text-white p-6 shadow-lg ring-1 ring-black/10">
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Gudang Obat</h2>
                <p className="text-white/90 text-sm">Kelola stok & pantau pergerakan obat per bulan.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-green-600 shadow hover:bg-gray-100 transition" onClick={() => setShowModal(true)}>
                  + Tambah Obat
                </button>
                <button className="inline-flex items-center justify-center rounded-xl bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow hover:bg-slate-50" onClick={exportCSV} disabled={filteredActiveData.length === 0}>
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Hanya navigasi bulan (default filter: Masuk) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonthIndex((p) => (p === null ? null : Math.max(0, p - 1)))}
              disabled={currentMonthIndex === null || currentMonthIndex === 0}
              className="px-3 py-1.5 rounded-xl bg-white ring-1 ring-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
              aria-label="Bulan sebelumnya"
            >
              ←
            </button>

            <div className="flex-1 text-center font-semibold text-slate-700">
              {activeMonthKey ? monthDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "Tidak ada data"}
            </div>

            <button
              onClick={() => setCurrentMonthIndex((p) => (p === null ? null : Math.min(monthKeys.length - 1, p + 1)))}
              disabled={currentMonthIndex === null || currentMonthIndex === monthKeys.length - 1 || monthKeys.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white ring-1 ring-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
              aria-label="Bulan berikutnya"
            >
              →
            </button>
          </div>

          {/* Chart */}
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-slate-200 p-4 shadow-sm">
            <div className="h-[280px]">
              {loading ? <div className="h-full grid place-items-center text-slate-400 text-sm">Memuat grafik…</div> : <Line data={chartData} options={chartOptions} />}
            </div>
          </div>

          {/* Summaries */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setView("masuk")} className={`text-left rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-sm p-4 flex items-center justify-between transition ${view === "masuk" ? "ring-2 ring-emerald-300" : "hover:shadow"}`}>
              <div>
                <p className="text-sm text-slate-500">Total Transaksi Masuk (bulan ini)</p>
                <h3 className="text-2xl font-bold text-emerald-600">{(activeData || []).filter((d) => d.jenis_transaksi === "Masuk").length.toLocaleString()}</h3>
              </div>
              <Badge tone="success">Masuk</Badge>
            </button>

            <button onClick={() => setView("keluar")} className={`text-left rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-sm p-4 flex items-center justify-between transition ${view === "keluar" ? "ring-2 ring-amber-300" : "hover:shadow"}`}>
              <div>
                <p className="text-sm text-slate-500">Total Transaksi Keluar (bulan ini)</p>
                <h3 className="text-2xl font-bold text-amber-600">{(activeData || []).filter((d) => d.jenis_transaksi === "Keluar").length.toLocaleString()}</h3>
              </div>
              <Badge tone="warn">Keluar</Badge>
            </button>
          </div>

          {/* Riwayat — kartu (mobile) / tabel (desktop lg) */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">Riwayat Transaksi</h4>
              <div className="text-xs text-slate-500">Menampilkan {tabelData.length} item</div>
            </div>

            {/* cards on small, table on large */}
            <div className="grid gap-4 lg:hidden max-h-[460px] overflow-auto pr-2">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4 shadow-sm" role="status" aria-hidden>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200 mt-2" />
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}

              {!loading && tabelData.length === 0 && (
                <div className="col-span-full">
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <svg width="68" height="68" viewBox="0 0 24 24" fill="none" className="mb-3" aria-hidden>
                      <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div className="text-sm font-medium">Belum ada data untuk filter ini.</div>
                    <div className="text-xs mt-1">Coba ubah rentang tanggal atau filter lainnya.</div>
                  </div>
                </div>
              )}

              {!loading &&
                tabelData.map((a) => {
                  const d = safeDate(a.created_at);
                  const tanggal = d && !isNaN(d) ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
                  const isMasuk = a.jenis_transaksi === "Masuk";
                  return (
                    <article key={a.id} className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 hover:shadow-md transition-colors" aria-labelledby={`title-${a.id}`} role="group">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p id={`title-${a.id}`} className="text-sm font-semibold text-slate-800">{a.nama_obat}</p>
                              <p className="text-xs text-slate-500">{a.kode_obat || "-"}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">{tanggal}</span>
                              <Badge tone={isMasuk ? "success" : "warn"}>{a.jenis_transaksi}</Badge>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge tone="muted">{(Number(a.qty) || 0).toLocaleString()} {a.satuan || ""}</Badge>
                              <div className="text-sm text-slate-700 break-words">{a.keterangan || "-"}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <InitialsAvatar name={a.petugas || "-"} />
                              <div className="text-sm text-slate-700">{a.petugas || "-"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* Table for large screens */}
            <div className="hidden lg:block max-h-[460px] overflow-auto">
              {loading ? (
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur">
                    <tr className="text-slate-700">
                      <th className="py-3 px-3 border-b text-left font-semibold">Tanggal</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Nama Obat</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Jumlah</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Jenis</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Keterangan</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Petugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="py-3 px-3 border-b"><div className="h-3 w-24 rounded bg-slate-200 animate-pulse" /></td>
                        <td className="py-3 px-3 border-b"><div className="h-3 w-40 rounded bg-slate-200 animate-pulse" /></td>
                        <td className="py-3 px-3 border-b"><div className="h-3 w-20 rounded bg-slate-200 animate-pulse" /></td>
                        <td className="py-3 px-3 border-b"><div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" /></td>
                        <td className="py-3 px-3 border-b"><div className="h-3 w-44 rounded bg-slate-200 animate-pulse" /></td>
                        <td className="py-3 px-3 border-b"><div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur">
                    <tr className="text-slate-700">
                      <th className="py-3 px-3 border-b text-left font-semibold">Tanggal</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Nama Obat</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Jumlah</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Jenis</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Keterangan</th>
                      <th className="py-3 px-3 border-b text-left font-semibold">Petugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabelData.map((a) => {
                      const d = safeDate(a.created_at);
                      const tanggal = d && !isNaN(d) ? d.toLocaleDateString("id-ID") : "-";
                      const isMasuk = a.jenis_transaksi === "Masuk";
                      return (
                        <tr key={a.id} className="even:bg-slate-50/40 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 border-b text-slate-700">{tanggal}</td>
                          <td className="py-3 px-3 border-b">
                            <div className="font-medium text-slate-800">{a.nama_obat}</div>
                            <div className="text-xs text-slate-500">{a.kode_obat || "-"}</div>
                          </td>
                          <td className="py-3 px-3 border-b">
                            <Badge tone="muted">{(Number(a.qty) || 0).toLocaleString()} {a.satuan || ""}</Badge>
                          </td>
                          <td className="py-3 px-3 border-b"><Badge tone={isMasuk ? "success" : "warn"}>{a.jenis_transaksi}</Badge></td>
                          <td className="py-3 px-3 border-b"><span className="text-slate-700">{a.keterangan || "-"}</span></td>
                          <td className="py-3 px-3 border-b">
                            <div className="flex items-center gap-2"><InitialsAvatar name={a.petugas || "-"} /><span className="text-slate-700">{a.petugas || "-"}</span></div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 p-3 mt-3">{error}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
  