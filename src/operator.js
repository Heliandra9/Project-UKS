import React, { useState, useEffect } from "react";
import Topbar from "./component(operator)/Topbar";
import TambahPasienView from "./component(operator)/view/TambahPasien";
import KunjunganView from "./component(operator)/view/Kunjungan";


export default function Operator() {

  const [view, setView] = useState("tambah");

  return (
    <div className="flex flex-col lg:h-screen pb-24 lg:pb-0">
      <Topbar view={view} setView={setView} />
      {view === "tambah" && <TambahPasienView />}
      {view === "kunjungan" && <KunjunganView />}
    </div>
  );
}
