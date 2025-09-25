import React, { useState, useEffect } from "react";
import Sidebar from "./component(operator)/Sidebar";
import TambahPasienView from "./component(operator)/view/TambahPasien";
import KunjunganView from "./component(operator)/view/Kunjungan";
import PageHeader from "./component(operator)/PageHeader";

export default function Operator() {
  const [view, setView] = useState(() => localStorage.getItem("view") || "tambah");

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  return (
    <div className="min-h-screen  bg-gradient-to-b from-green-50/70 to-white ">
      {/* Sidebar */}
      <Sidebar view={view} setView={setView} />

      {/* Konten */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {view === "tambah" && (
            <>
              <PageHeader
                title="Halaman Tambah Pasien!"
                subtitle="Selamat datang  ! Ini halaman tambah pasien lakukan penambahan data pasien UKS di sekolah Anda"
              />
              <TambahPasienView />
            </>
          )}

          {view === "kunjungan" && (
            <>
              <KunjunganView />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
