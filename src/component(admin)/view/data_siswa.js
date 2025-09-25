import { Table, Modal } from "../Component";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Siswa(props) {
  // Parent diharapkan menyediakan:
  // props.modal, props.setModal
  // props.modalName, props.setModalName
  // props.data, props.setData
  // props.cari

  const [siswa, setSiswa] = useState([]);

  const getDataSiswa = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then((res) => res.json())
      .then((data) => setSiswa(data))
      .catch((err) => console.error("Gagal ambil data siswa:", err));
  };

  useEffect(() => {
    getDataSiswa();
  }, []);

  // ✅ toggle modal pakai functional update
  const toggleModal = () => props.setModal((v) => !v);

  // ✅ handler dari tombol aksi di Table baru
  const handleEdit = (item) => {
    props.setData(item);
    props.setModalName("edit");
    props.setModal(true);
  };

  const handleDelete = (item) => {
    props.setData(item);
    props.setModalName("delete");
    props.setModal(true);
  };

  // (opsional) tombol tambah
  const handleInsert = () => {
    props.setData({});
    props.setModalName("insert");
    props.setModal(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-3">
      

      <Table
        view="siswa"
        data={siswa}
        cari={props.cari}
        onEdit={handleEdit}    
        onDelete={handleDelete}
      />

      <Modal
        stat={props.modal}
        setM={toggleModal}
        name={props.modalName}
        data={props.data}
        view="siswa"
        siswa={siswa}
        title={
          props.modalName === "edit"
            ? "Edit data siswa"
            : props.modalName === "delete"
            ? "Hapus data siswa"
            : props.modalName === "insert" && "Tambah data siswa"
        }
        onSubmit={(form) => {
          const formBody = new URLSearchParams();

          let endpoint = "";
          if (props.modalName === "insert") {
            // kirim semua field untuk insert
            for (const key in form) formBody.append(key, form[key] ?? "");
            endpoint =
              "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=siswa";
          } else if (props.modalName === "edit") {
            // kirim semua field + id untuk edit
            for (const key in form) formBody.append(key, form[key] ?? "");
            if (props.data?.id) formBody.set("id", props.data.id);
            // kalau backend butuh tipe, pakai query ?type=siswa
            endpoint =
              "http://localhost/pkl/Project-UKS/backend/proses/proses_edit.php?type=siswa";
          } else if (props.modalName === "delete") {
            // hapus: cukup kirim id + type
            if (props.data?.id) formBody.set("id", props.data.id);
            endpoint =
              "http://localhost/pkl/Project-UKS/backend/proses/proses_hapus.php?type=siswa";
          }

          return fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formBody.toString(),
          })
            .then((res) => res.json())
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
                getDataSiswa();
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
              console.error("Error:", err);
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

export default Siswa;
