import { useState, useEffect } from "react";
import { Table, Modal } from "../Component";
import Swal from "sweetalert2";

function Kunjungan(props) {
  // Parent diharapkan menyediakan:
  // props.modal, props.setModal
  // props.modalName, props.setModalName
  // props.data, props.setData
  // props.cari

  const [kunjungan, setKunjungan] = useState([]);        // ✅ array (bukan string)
  const [siswa, setSiswa] = useState([]);
  const [obat, setDataObat] = useState([]);

  // Form & error dikontrol dari halaman ini (opsional; Modal juga bisa self-managed)
  const [form, setForm] = useState({ kelas: "", id_siswa: "", keluhan: "", obat: [], keterangan: "", tanggal: "" });
  const [error, setError] = useState({});

  const getDataKunjungan = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=kunjungan")
      .then((res) => res.json())
      .then((data) => setKunjungan(data || []))
      .catch((err) => console.error("Gagal ambil data kunjungan:", err));
  };

  const getDataSiswa = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then((res) => res.json())
      .then((data) => setSiswa(data || []))
      .catch((err) => console.error("Gagal ambil data siswa:", err));
  };

  const getDataObat = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=obat")
      .then((res) => res.json())
      .then((data) => setDataObat((data || []).filter((o) => o.is_deleted === "0")))
      .catch((err) => console.error("Gagal ambil data obat:", err));
  };

  useEffect(() => {
    getDataKunjungan();
    getDataSiswa();
    getDataObat();
  }, []);

  // ✅ toggle modal aman (hindari race)
  const toggleModal = () => props.setModal((v) => !v);

  // ✅ handler tombol dari Table baru
  const handleEdit = (item) => {
    props.setData(item);
    props.setModalName("edit");
    // set form default berdasarkan item
    setForm({
      kelas: item.kelas ?? "",
      id_siswa: item.id_siswa ?? "",
      keluhan: item.keluhan ?? "",
      // backend biasanya menyimpan resep jadi string; pastikan adaptermu mengubah ke array jika perlu
      obat: item.obat || item.obat_list || [], // fallback
      keterangan: item.keterangan ?? "",
      tanggal: (item.tanggal || "").slice(0, 10), // yyyy-mm-dd untuk <input type="date">
    });
    props.setModal(true);
  };

  const handleDelete = (item) => {
    props.setData(item);
    props.setModalName("delete");
    props.setModal(true);
  };

  const handleInsert = () => {
    props.setData({});
    props.setModalName("insert");
    setForm({ kelas: "", id_siswa: "", keluhan: "", obat: [], keterangan: "", tanggal: "" });
    props.setModal(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-3">

      <Table
        view="kunjungan"
        data={kunjungan}
        cari={props.cari}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        stat={props.modal}
        setM={toggleModal}
        name={props.modalName}
        data={props.data}
        view="kunjungan"
        siswa={siswa}
        obat={obat}
        // controlled form (opsional, boleh dihapus kalau mau pakai internal state Modal)
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        title={
          props.modalName === "edit"
            ? "Edit data kunjungan"
            : props.modalName === "delete"
            ? "Hapus data kunjungan"
            : props.modalName === "insert" && "Tambah data kunjungan"
        }
        onSubmit={(formSend) => {
          const formBody = new URLSearchParams();

          // serialisasi: 'obat' → JSON string
          for (const key in formSend) {
            if (key === "obat") {
              formBody.append("obat", JSON.stringify(formSend.obat || []));
            } else {
              formBody.append(key, formSend[key] ?? "");
            }
          }

          let endpoint = "";
          if (props.modalName === "insert") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=kunjungan";
          } else if (props.modalName === "edit") {
            // pastikan id ikut
            if (props.data?.id) formBody.set("id", props.data.id);
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_edit.php?type=kunjungan";
          } else if (props.modalName === "delete") {
            // hapus cukup id + type
            if (props.data?.id) formBody.set("id", props.data.id);
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_hapus.php?type=kunjungan";
          }

          return fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formBody.toString(),
          })
            .then(async (res) => {
              const text = await res.text();
              try {
                return JSON.parse(text);
              } catch {
                throw new Error(`Response bukan JSON: ${text}`);
              }
            })
            .then((result) => {
              if (result.status === "success") {
                Swal.fire({
                  icon: "success",
                  title: "Berhasil!",
                  text:
                    props.modalName === "edit"
                      ? "Data berhasil diubah"
                      : props.modalName === "delete"
                      ? "Data berhasil dihapus"
                      : "Data berhasil ditambahkan",
                  timer: 1500,
                  showConfirmButton: false,
                });
                getDataKunjungan();
                props.setModal(false);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Gagal!",
                  text: result.message || "Terjadi kesalahan",
                  showConfirmButton: true,
                });
              }
            })
            .catch((err) => {
              console.error("Fetch error:", err);
              Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Tidak dapat terhubung ke server",
                showConfirmButton: true,
              });
            });
        }}
      />
    </div>
  );
}

export default Kunjungan;
