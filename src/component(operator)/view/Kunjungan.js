import React, { useEffect, useState } from "react";

export default function KunjunganView() {
  const [siswa, setSiswa] = useState([]);
  const [kunjungan, setKunjungan] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [kelas, setKelas] = useState("semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // fetch siswa
    fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then((res) => res.json())
      .then((data) => setSiswa(data));

    // fetch kunjungan
    fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=kunjungan")
      .then((res) => res.json())
      .then((data) => setKunjungan(data));
  }, []);

  // toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // gabungkan siswa + riwayat kunjungan
  const grouped = siswa
    .filter(
      (s) =>
        (kelas === "semua" || s.kelas === kelas) &&
        s.nama_siswa.toLowerCase().includes(search.toLowerCase())
    )
    .map((s) => ({
      ...s,
      kunjunganList: kunjungan.filter((k) => k.id_siswa === s.id_siswa),
    }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Data Kunjungan</h2>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="semua">Semua Kelas</option>
          {[...new Set(siswa.map((s) => s.kelas))].map((kls) => (
            <option key={kls} value={kls}>
              {kls}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Cari siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* List card per siswa */}
      <div className="space-y-4">
        {grouped.map((s) => {
          const isExpanded = expandedIds.has(s.id_siswa);
          return (
            <div
              key={s.id_siswa}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(s.id_siswa)}
              >
                <div>
                  <h4 className="font-semibold text-green-700">
                    {s.nama_siswa}
                  </h4>
                  <p className="text-sm text-gray-600">{s.kelas}</p>
                </div>
                <button className="text-green-600">
                  {isExpanded ? "▲" : "▼"}
                </button>
              </div>

              {/* Detail kunjungan */}
              {isExpanded && (
                <div className="mt-3 space-y-2">
                  {s.kunjunganList.length > 0 ? (
                    s.kunjunganList.map((k) => (
                      <div
                        key={k.id_kunjungan}
                        className="p-3 border rounded-lg bg-white"
                      >
                        <p className="text-sm">
                          <span className="font-semibold">Tanggal:</span>{" "}
                          {k.tanggal}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Keluhan:</span>{" "}
                          {k.keluhan}
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
                    <p className="text-sm text-gray-500 italic">
                      Belum ada kunjungan
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {grouped.length === 0 && (
          <p className="text-center text-gray-500 italic">
            Tidak ada data siswa
          </p>
        )}
      </div>
    </div>
  );
}
