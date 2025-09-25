import React, { useMemo, useState, useRef, useEffect } from "react";
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
import { FiX, FiSearch, FiEdit2, FiTrash2, FiChevronDown } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ================= Helpers =================
export function formatTanggalDB(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

// ================= Theme (Hijau) =================
const brand = {
  grad: "bg-gradient-to-tr from-emerald-500 to-lime-500",
  ring: "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-white",
  border: "border border-gray-200",
  // pakai ! untuk override CSS lain
  focusStrong: "focus:!outline-none focus:!ring-2 focus:!ring-emerald-500 focus:!border-emerald-500",
  focusText: "peer-focus:text-emerald-600",
  btnPrimary: "bg-emerald-600 hover:bg-emerald-700",
};

// ================= Atoms =================
export function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white shadow-sm ${brand.border} ${className}`}>{children}</div>;
}

const buttonVariants = {
  primary: `text-white ${brand.grad}`,
  outline: "bg-white text-gray-700 border border-gray-300",
  danger: "bg-rose-500 text-white",
  success: "bg-emerald-500 text-white",
};

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium shadow-sm transition hover:opacity-95 active:opacity-90";
  return (
    <button className={`${base} ${buttonVariants[variant]} ${brand.ring} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  rightIcon,
  className = "",
  error = "",
  helpText = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder=" "
        className={`peer block w-full rounded-xl bg-white px-3 py-3 text-sm shadow-sm placeholder:text-transparent
          ${error
            ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-400"
            : "border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
          }`}
      />
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-3 
          top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-200
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
          peer-focus:-top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-emerald-600
          peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:text-emerald-600`}
      >
        {label}
      </label>

      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {rightIcon}
        </span>
      )}

      {/* Help text / error message */}
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
}



// ================= Layout =================
export function Sidebar({ logo, view, setView, className = "" }) {
  const items = [
    { key: "home", label: "Beranda", icon: "bi bi-house-door-fill" },
    { key: "siswa", label: "Data Siswa", icon: "bi bi-person-fill" },
    { key: "obat", label: "Data Obat", icon: "bi bi-capsule" },
    { key: "kunjungan", label: "Daftar Kunjungan", icon: "bi bi-card-list" },
    { key: "user", label: "Kelola User", icon: "bi bi-people-fill" },
  ];
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 border-r border-gray-200 bg-white/90 backdrop-blur md:flex md:flex-col ${className}`}>
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        {logo ? <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl object-cover" /> : <div className={`h-10 w-10 rounded-xl ${brand.grad}`} />}
        <div>
          <div className="text-xs text-gray-500">UKS Sekolah</div>
          <div className="font-bold">SMKN 2 Tasikmalaya</div>
        </div>
      </div>
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setView?.(it.key)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === it.key ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <span className={`grid h-8 w-8 place-items-center rounded-lg ${view === it.key ? brand.grad + " text-white" : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"}`}>
              <i className={it.icon} />
            </span>
            {it.label}
            {view === it.key && <FiChevronDown className="ml-auto h-4 w-4 rotate-[-90deg] text-gray-400" />}
          </button>
        ))}
      </nav>
      <div className="p-3">
        <Card className="p-4">
          <div className="text-sm font-semibold">Tips</div>
          <p className="mt-1 text-xs text-gray-600">Gunakan pencarian dan filter agar data cepat ditemukan.</p>
        </Card>
      </div>
    </aside>
  );
}

export function Topbar({ q, setQ }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-3 md:pl-64">
        <div className="relative ml-auto w-full max-w-md">
          <input
            value={q}
            onChange={(e) => setQ?.(e.target.value)}
            className={`w-full rounded-xl border border-gray-300 bg-white px-10 py-2.5 text-sm shadow-sm placeholder:text-gray-400 ${brand.ring}`}
            placeholder="Cari data…"
          />
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gray-200" />
          <div className="hidden text-left md:block">
            <div className="text-xs text-gray-500">Admin</div>
            <div className="text-sm font-semibold">UKS</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ================= Cards =================
export function StatCard({ title, value, hint, icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
          {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${brand.grad} text-white`}>{icon}</div>
      </div>
    </Card>
  );
}

// ================= Chart =================
export function Chart({ title = "Statistik UKS", data }) {
  const chartData = useMemo(() => ({
    labels: data?.labels ?? ["Data siswa", "Data obat", "Daftar kunjungan", "Data surat"],
    datasets: [
      {
        label: "Jumlah",
        data: data?.values ?? [600, 876, 364, 534],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(132, 204, 22, 0.8)",
          "rgba(5, 150, 105, 0.8)",
        ],
        borderRadius: 8,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: title } },
    scales: { y: { beginAtZero: true } },
  }), [title]);

  return (
    <Card className="p-4">
      <Bar data={chartData} options={options} className="w-full h-full" />
    </Card>
  );
}

// ================= Table =================
export function Table({ view, data = [], cari = "", onEdit, onDelete }) {
  const filtered = useMemo(() => {
    if (!cari) return data;
    const k = String(cari).toLowerCase();
    switch (view) {
      case "siswa":
        return data.filter(
          (it) =>
            it.nama?.toLowerCase().includes(k) ||
            it.kelas?.toLowerCase().includes(k) ||
            String(it.nis ?? "").includes(k)
        );
      case "obat":
        return data.filter(
          (it) =>
            it.nama_obat?.toLowerCase().includes(k) ||
            it.kode_obat?.toLowerCase().includes(k) ||
            it.kandungan?.toLowerCase().includes(k) ||
            it.satuan?.toLowerCase().includes(k)
        );
      case "kunjungan":
        return data.filter(
          (it) =>
            it.nama_siswa?.toLowerCase().includes(k) ||
            it.kelas?.toLowerCase().includes(k) ||
            it.keluhan?.toLowerCase().includes(k) ||
            it.tanggal?.includes(k) ||
            it.obat_dengan_qty?.toLowerCase().includes(k) ||
            it.keterangan?.toLowerCase().includes(k)
        );
      case "user":
        return data.filter(
          (it) =>
            it.username?.toLowerCase().includes(k) ||
            String(it.password ?? "").toLowerCase().includes(k) ||
            it.tipe_user?.toLowerCase().includes(k)
        );
      default:
        return data;
    }
  }, [data, cari, view]);

  const colsByView = {
    siswa: ["No", "Nama Lengkap", "Kelas", "NIS", "Tinggi Badan", "Berat Badan", "Golongan Darah", "Aksi"],
    obat: ["No", "Nama Obat", "Kode Obat", "Jenis Obat", "Kandungan Obat", "Stock Obat", "Aksi"],
    kunjungan: ["No", "Nama", "Kelas", "Keluhan", "Tanggal Kunjungan", "Keterangan", "Resep Obat Diberikan", "Aksi"],
    user: ["No", "Username", "Password", "Tipe User", "Aksi"],
  };

  const headers = colsByView[view] ?? [];

  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-6 text-center text-gray-500">Data tidak ada</td>
            </tr>
          ) : (
            filtered.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3">{i + 1}</td>
                {view === "siswa" && (
                  <>
                    <td className="px-4 py-3 capitalize">{item.nama}</td>
                    <td className="px-4 py-3 uppercase">{item.kelas}</td>
                    <td className="px-4 py-3">{item.nis}</td>
                    <td className="px-4 py-3">{item.tinggi_badan}</td>
                    <td className="px-4 py-3">{item.berat_badan}</td>
                    <td className="px-4 py-3">{item.golongan_darah}</td>
                  </>
                )}
                {view === "obat" && (
                  <>
                    <td className="px-4 py-3 capitalize">{item.nama_obat}</td>
                    <td className="px-4 py-3 uppercase">{item.kode_obat}</td>
                    <td className="px-4 py-3">{item.jenis_obat}</td>
                    <td className="px-4 py-3">{item.kandungan}</td>
                    <td className="px-4 py-3">{item.stock_dengan_satuan}</td>
                  </>
                )}
                {view === "kunjungan" && (
                  <>
                    <td className="px-4 py-3 capitalize">{item.nama_siswa}</td>
                    <td className="px-4 py-3 uppercase">{item.kelas}</td>
                    <td className="px-4 py-3">{item.keluhan}</td>
                    <td className="px-4 py-3">{formatTanggalDB(item.tanggal) || "-"}</td>
                    <td className="px-4 py-3">{item.keterangan}</td>
                    <td className="px-4 py-3">{item.obat_dengan_qty}</td>
                  </>
                )}
                {view === "user" && (
                  <>
                    <td className="px-4 py-3 capitalize">{item.username}</td>
                    <td className="px-4 py-3">{item.password}</td>
                    <td className="px-4 py-3">{item.tipe_user}</td>
                  </>
                )}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="primary" className="!px-3" onClick={() => onEdit?.(item)}>
                      <FiEdit2 className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="danger" className="!px-3" onClick={() => onDelete?.(item)}>
                      <FiTrash2 className="h-4 w-4" /> Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}



// ================= Modal =================
export function Modal(props) {
  const {
    stat, setM, onClose,
    name,
    title,
    view,
    data,
    siswa, obat,
    onSubmit,
    form: extForm, setForm: extSetForm,
    error: extError, setError: extSetError,
    disableOverlayClose,
    confirmText: confirmTextProp,
    cancelText = "Batal",
    kelasOptions,
  } = props;

  /** Helper: pecah "10 pcs" -> { stock_obat: "10", satuan: "pcs" } */
  const splitStockWithUnit = (val) => {
    if (!val) return { stock_obat: "", satuan: "" };
    const [angka, unit] = String(val).trim().split(/\s+/);
    return { stock_obat: angka ?? "", satuan: unit ?? "" };
  };

  // ====== Field config per view ======
  const fields =
    view === "siswa"
      ? [
        { name: "nama", label: "Nama" },
        { name: "kelas", label: "Kelas" },
        { name: "nis", label: "NIS" },
        { name: "tinggi_badan", label: "Tinggi Badan" },
        { name: "berat_badan", label: "Berat Badan" },
        { name: "golongan_darah", label: "Golongan Darah" },
      ]
      : view === "obat"
        ? [
          { name: "nama_obat", label: "Nama Obat" },
          { name: "kode_obat", label: "Kode Obat" },
          { name: "kandungan", label: "Kandungan Obat" },
          { name: "jenis_obat", label: "Jenis Obat" },    // select (Tablet, Sirup, dsb)
          { name: "stock_obat", label: "Stock Obat" },    // digabung dengan satuan
        ]
        : view === "kunjungan"
          ? [
            { name: "kelas", label: "Kelas" },
            { name: "id_siswa", label: "Nama" },
            ...(name === "edit" ? [{ name: "tanggal", label: "Tanggal" }] : []),
            { name: "keluhan", label: "Keluhan siswa" },
            { name: "obat", label: "Resep Diberikan" },
            { name: "keterangan", label: "Keterangan" },
          ]
          : view === "user"
            ? [
              { name: "username", label: "Username" },
              { name: "password", label: "Password" },
              { name: "tipe_user", label: "Tipe User" },
            ]
            : [];

  // ====== Default form per view ======
  const defaultFormByView = {
    siswa: { nama: "", kelas: "", nis: "", tinggi_badan: "", berat_badan: "", golongan_darah: "" },
    obat: { id: "", nama_obat: "", kode_obat: "", kandungan: "", jenis_obat: "", satuan: "", stock_obat: "" },
    kunjungan: { kelas: "", id_siswa: "", keluhan: "", obat: [], keterangan: "", tanggal: "" },
    user: { username: "", password: "", tipe_user: "" },
  };

  // ====== local or controlled state ======
  const [localForm, setLocalForm] = useState(defaultFormByView[view] || {});
  const [localError, setLocalError] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const form = extForm ?? localForm;
  const setForm = extSetForm ?? setLocalForm;
  const error = extError ?? localError;
  const setError = extSetError ?? setLocalError;

  // ====== Derived lists ======
  const listKelasKunjungan = useMemo(() => {
    if (view !== "kunjungan" || !Array.isArray(siswa)) return [];
    return [...new Set(siswa.map((s) => (s.kelas || "").trim()))].filter(Boolean);
  }, [view, siswa]);

  const filteredNama = useMemo(() => {
    if (view !== "kunjungan" || !Array.isArray(siswa) || !form.kelas) return [];
    return siswa.filter((s) => s.kelas === form.kelas);
  }, [view, siswa, form.kelas]);

  const listKelasSiswa = useMemo(() => {
    if (Array.isArray(kelasOptions) && kelasOptions.length) return kelasOptions;
    if (Array.isArray(siswa) && siswa.length) {
      return [...new Set(siswa.map((s) => (s.kelas || "").trim()))].filter(Boolean);
    }
    return form?.kelas ? [form.kelas] : [];
  }, [kelasOptions, siswa, form?.kelas]);

  // ====== Lifecycle: reset saat modal dibuka ======
  useEffect(() => {
    if (!stat) return;
    const base = defaultFormByView[view] || {};
    let next = data ? { ...base, ...data } : base;

    // Jika view obat dan backend hanya kirim 'stock_dengan_satuan'
    if (view === "obat" && next.stock_dengan_satuan) {
      const parsed = splitStockWithUnit(next.stock_dengan_satuan);
      if (!next.stock_obat) next.stock_obat = parsed.stock_obat;
      if (!next.satuan) next.satuan = parsed.satuan;
    }

    setForm(next);
    setError({});
    setSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stat, view, data]);

  // ====== UX: ESC close, lock scroll, autofocus, focus trap ======
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!stat) return;
    const onKey = (e) => e.key === "Escape" && (onClose ?? setM)?.();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      (firstFieldRef.current ||
        dialogRef.current?.querySelector?.("input,select,textarea,button")
      )?.focus?.();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [stat, onClose, setM]);

  useEffect(() => {
    if (!stat) return;
    const root = dialogRef.current;
    if (!root) return;
    const selector =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const getNodes = () =>
      Array.from(root.querySelectorAll(selector)).filter(
        (n) => !n.hasAttribute("disabled")
      );
    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const nodes = getNodes();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [stat]);

  const close = () => (onClose ?? setM)?.();

  // ====== Handlers ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (view === "kunjungan") {
      setForm((p) => ({ ...p, [name]: value, ...(name === "kelas" ? { id_siswa: "" } : {}) }));
    } else if (view === "obat" && name === "stock_obat") {
      const num = String(value).replace(/[^\d]/g, "");
      setForm((p) => ({ ...p, stock_obat: num }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const onFormKeyDown = (e) => {
    if (e.key === "Enter" && name !== "delete") {
      e.preventDefault();
      handleConfirm();
    }
  };

  const validate = () => {
    const newError = {};
    let ok = true;
    if (name === "edit" || name === "insert") {
      for (const f of fields) {
        const v = form[f.name];
        if (
          v === undefined ||
          v === null ||
          (typeof v === "string" && v.trim().length === 0) ||
          (Array.isArray(v) && v.length === 0)
        ) {
          newError[f.name] = `${f.label} tidak boleh kosong`;
          ok = false;
        }
      }
      if (view === "kunjungan" && (!form.id_siswa || String(form.id_siswa).length === 0)) {
        newError.id_siswa = "Nama siswa harus dipilih";
        ok = false;
      }
    }
    setError(newError);
    return ok;
  };

  const handleConfirm = async () => {
    if (submitting) return;
    if (name !== "delete" && !validate()) return;
    try {
      setSubmitting(true);
      let finalForm = { ...form };
      if (view === "obat") {
        finalForm.petugas = localStorage.getItem("username") || "Admin";
        finalForm.keterangan = "Penambahan stok awal";
      }
      await onSubmit?.(finalForm);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmText =
    confirmTextProp || (name === "delete" ? "Hapus" : name === "insert" ? "Tambahkan" : "Simpan");

  // ====== UI helpers ======
  const fieldInputClass =
    "w-full rounded-lg border px-3 py-2 text-sm shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300";
  const fieldDisabledClass =
    "w-full rounded-lg border px-3 py-2 text-sm shadow-sm border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed";

  // fallback satuan jika tidak ada
  const unitFromObat = (o) => {
    if (o?.satuan) return o.satuan;
    const parsed = splitStockWithUnit(o?.stock_dengan_satuan);
    if (parsed.satuan) return parsed.satuan;
    // default: jenis cair → ml, lainnya → pcs
    const liquidKinds = ["Sirup"];
    return liquidKinds.includes((o?.jenis_obat || "").trim()) ? "ml" : "pcs";
  };

  // Master options (sesuai permintaan)
  const JENIS_OBAT_MASTER = ["Tablet", "Sirup", "Kapsul", "Salep", "Botol"];
  const SATUAN_OPTIONS = ["pcs", "ml"];

  return (
    <div
      className={`fixed inset-0 z-50 ${stat ? "opacity-100" : "pointer-events-none opacity-0"} transition-opacity`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={onFormKeyDown}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => {
          if (!disableOverlayClose) close();
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 grid place-items-center px-4">
        <div
          ref={dialogRef}
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 outline-none"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            aria-label="Tutup modal"
          >
            <FiX size={20} />
          </button>

          <div className="px-6 pt-6">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>

          <div className="px-6 pb-2">
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {name !== "delete" ? (
                <div className="grid gap-4">
                  {/* Hidden inputs untuk kunjungan (array obat) */}
                  {view === "kunjungan" &&
                    Array.isArray(form.obat) &&
                    form.obat.length > 0 &&
                    form.obat.map((o, i) => (
                      <input key={`hidden-${i}`} type="hidden" name={`obat[${i}][id_obat]`} value={o.id_obat || ""} />
                    ))}

                  {/* Render field dari config */}
                  {fields.map((field, idx) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">{field.label}</label>

                      {/* --- KELAS (siswa/kunjungan) --- */}
                      {field.name === "kelas" ? (
                        view === "kunjungan" ? (
                          <select
                            ref={idx === 0 ? firstFieldRef : undefined}
                            name="kelas"
                            value={form?.kelas ?? ""}
                            onChange={handleChange}
                            className={fieldInputClass}
                          >
                            <option value="">-- Pilih Kelas --</option>
                            {listKelasKunjungan.map((k, i2) => (
                              <option key={i2} value={k}>{k}</option>
                            ))}
                          </select>
                        ) : name === "edit" && view === "siswa" ? (
                          <select
                            ref={idx === 0 ? firstFieldRef : undefined}
                            name="kelas"
                            value={form?.kelas ?? ""}
                            onChange={handleChange}
                            className={fieldInputClass}
                          >
                            <option value="">-- Pilih Kelas --</option>
                            {listKelasSiswa.map((k, i2) => (
                              <option key={i2} value={k}>{k}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            ref={idx === 0 ? firstFieldRef : undefined}
                            name="kelas"
                            value={form?.kelas ?? ""}
                            onChange={handleChange}
                            className={fieldInputClass}
                            type="text"
                            autoComplete="off"
                            placeholder="Contoh: X RPL 1"
                          />
                        )

                        /* --- NAMA SISWA (kunjungan) --- */
                      ) : field.name === "id_siswa" ? (
                        <select
                          name="id_siswa"
                          value={form?.id_siswa ?? ""}
                          onChange={handleChange}
                          disabled={!form?.kelas}
                          className={!form?.kelas ? fieldDisabledClass : fieldInputClass}
                        >
                          <option value="">{form?.kelas ? "-- Pilih Nama --" : "-- Pilih Kelas dahulu --"}</option>
                          {filteredNama.map((s) => (
                            <option key={s.id} value={s.id}>{s.nama}</option>
                          ))}
                        </select>

                        /* --- TANGGAL (edit kunjungan) --- */
                      ) : field.name === "tanggal" && name === "edit" ? (
                        <input
                          type="date"
                          name="tanggal"
                          value={form?.tanggal ?? ""}
                          onChange={handleChange}
                          className={fieldInputClass}
                        />

                        /* --- JENIS OBAT (select) --- */
                      ) : field.name === "jenis_obat" && view === "obat" ? (
                        <select
                          name="jenis_obat"
                          value={form?.jenis_obat ?? ""}
                          onChange={handleChange}
                          className={fieldInputClass}
                        >
                          <option value="">-- Pilih Jenis Obat --</option>
                          {["Tablet", "Sirup", "Kapsul", "Salep", "Botol"].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>

                        /* --- STOCK OBAT + SATUAN (gabung) --- */
                      ) : field.name === "stock_obat" && view === "obat" ? (
                        <div className="space-y-1">
                          <div className="flex rounded-lg border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-green-300 focus-within:border-green-300">
                            <input
                              ref={idx === 0 ? firstFieldRef : undefined}
                              type="number"
                              name="stock_obat"
                              min={1}
                              value={form?.stock_obat ?? ""}
                              onChange={(e) =>
                                setForm((p) => ({ ...p, stock_obat: e.target.value.replace(/[^\d]/g, "") }))
                              }
                              className="w-full rounded-l-lg px-3 py-2 text-sm outline-none"
                              placeholder="Masukkan jumlah"
                            />
                            <select
                              name="satuan"
                              value={form?.satuan ?? ""}
                              onChange={handleChange}
                              className="rounded-r-lg border-l border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                            >
                              <option value="">Satuan</option>
                              {["pcs", "ml"].map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        /* --- RESEP OBAT (kunjungan) --- */
                      ) : field.name === "obat" ? (
                        <div className="space-y-3">
                          {/* Chips resep terpilih */}
                          <div className="flex flex-wrap gap-2">
                            {(form.obat || []).map((o, i2) => (
                              <div key={i2} className="flex items-center rounded-full bg-green-100 px-3 py-1 text-green-800 shadow-sm">
                                <input type="hidden" name={`obat[${i2}][id_obat]`} value={o.id_obat || ""} />
                                <span className="mr-2">{o.nama}</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={o.jumlah}
                                  onChange={(e) => {
                                    const nv = [...(form.obat || [])];
                                    nv[i2].jumlah = Math.max(parseInt(e.target.value) || 1, 1);
                                    setForm({ ...form, obat: nv });
                                  }}
                                  className="w-12 border-b border-green-300 bg-transparent text-center text-sm focus:outline-none"
                                />
                                <span className="ml-2 text-sm">{o.satuan}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setForm({
                                      ...form,
                                      obat: (form.obat || []).filter((_, j) => j !== i2),
                                    })
                                  }
                                  className="ml-2 text-green-700 hover:text-rose-600"
                                  aria-label="Hapus obat"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Daftar obat untuk dipilih */}
                          <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-300 p-2 shadow-inner">
                            {(!obat || obat.length === 0) && (
                              <p className="py-3 text-center text-sm text-gray-500">Tidak ada data obat</p>
                            )}
                            {(obat || []).map((o) => {
                              const idxSel = (form.obat || []).findIndex((x) => String(x.id_obat) === String(o.id));
                              const selected = idxSel !== -1;
                              const satuan = unitFromObat(o);
                              return (
                                <div
                                  key={o.id}
                                  onClick={() => {
                                    if (selected) {
                                      const nv = [...(form.obat || [])];
                                      nv[idxSel].jumlah += 1;
                                      setForm({ ...form, obat: nv });
                                    } else {
                                      setForm({
                                        ...form,
                                        obat: [
                                          ...(form.obat || []),
                                          { id_obat: o.id, nama: o.nama_obat, jumlah: 1, satuan },
                                        ],
                                      });
                                    }
                                  }}
                                  className={`mb-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition ${selected ? "bg-green-100 font-semibold text-green-800" : "hover:bg-gray-100"}`}
                                >
                                  <span>{o.nama_obat}</span>
                                  <span className="text-xs text-gray-500">
                                    Stok: {o.stock_dengan_satuan || o.stock_obat}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        /* --- INPUT BIASA --- */
                      ) : (
                        <input
                          ref={idx === 0 ? firstFieldRef : undefined}
                          name={field.name}
                          value={form?.[field.name] ?? ""}
                          onChange={handleChange}
                          className={fieldInputClass}
                          type={field.name === "password" ? "password" : "text"}
                          autoComplete={field.name === "password" ? "new-password" : "off"}
                        />
                      )}

                      {error[field.name] && <p className="text-sm text-rose-600">{error[field.name]}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-700">
                  Apakah anda yakin ingin menghapus data{" "}
                  <span className="font-semibold">{data?.nama || data?.nama_obat || data?.username || ""}</span>?
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-4">
            <button
              onClick={close}
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${name === "delete" ? "bg-rose-600 hover:bg-rose-700" : "bg-green-600 hover:bg-green-700"
                } ${submitting ? "opacity-70" : ""}`}
            >
              {submitting ? "Memproses…" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





export default Modal;
