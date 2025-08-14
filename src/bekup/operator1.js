import React, { useState } from "react";
import { Button } from "../component/Component";
import { useNavigate } from "react-router-dom";

const availableMedicines = [
  { name: "Paracetamol", type: "Tablet", unit: "tablet" },
  { name: "Amoxicillin", type: "Kapsul", unit: "kapsul" },
  { name: "OBH Combi", type: "Sirup", unit: "ml" },
  { name: "Sanmol", type: "Sirup", unit: "ml" },
];

export default function Operator() {
  const [patient, setPatient] = useState({
    nama: "",
    umur: "",
    jenisKelamin: "Laki-laki",
  });

  const [resep, setResep] = useState([{ obat: "", jumlah: "", satuan: "" }]);

  const handlePatientChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleResepChange = (index, field, value) => {
    const newResep = [...resep];
    newResep[index][field] = value;

    // Otomatis isi satuan jika obat dipilih
    if (field === "obat") {
      const found = availableMedicines.find((m) => m.name === value);
      newResep[index].satuan = found?.unit || "";
    }

    setResep(newResep);
  };

  const addResep = () => {
    setResep([...resep, { obat: "", jumlah: "", satuan: "" }]);
  };

  const removeResep = (index) => {
    const newResep = resep.filter((_, i) => i !== index);
    setResep(newResep);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data pasien:", patient);
    console.log("Resep:", resep);
    // Kirim ke backend di sini
  };

   const navigate = useNavigate();

  const logot = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Tambah Pasien</h2>
      <button
        onClick={logot}
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-all"
      >
        Logout
      </button>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Pasien */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              name="nama"
              value={patient.nama}
              onChange={handlePatientChange}
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Umur</label>
            <input
              name="umur"
              value={patient.umur}
              onChange={handlePatientChange}
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Jenis Kelamin</label>
            <select
              name="jenisKelamin"
              value={patient.jenisKelamin}
              onChange={handlePatientChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        {/* Form Resep */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Resep Obat
          </label>
          <div className="space-y-4">
            {resep.map((item, index) => (
              <div
                key={index}
                className="grid md:grid-cols-4 gap-4 items-center"
              >
                <div>
                  <label className="block text-sm font-medium">Obat</label>
                  <select
                    value={item.obat}
                    onChange={(e) =>
                      handleResepChange(index, "obat", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">-- Pilih Obat --</option>
                    {availableMedicines.map((obat, idx) => (
                      <option key={idx} value={obat.name}>
                        {obat.name} ({obat.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Jumlah</label>
                  <input
                    type="number"
                    value={item.jumlah}
                    onChange={(e) =>
                      handleResepChange(index, "jumlah", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">satuan</label>
                  <input
                    type="text"
                    value={item.satuan}
                    readOnly
                    className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {index > 0 && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => removeResep(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={addResep}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Tambah Obat
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          Simpan Pasien
        </button>
      </form>
    </div>
  );
}
