import { useState, useEffect } from "react";
import { Table, Modal } from "../Component";
import Swal from "sweetalert2";

function Obat(props) {

  const [obat, setObat] = useState([]);

  const getDataObat = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=obat")
      .then((res) => res.json())
      .then((data) => setObat((data || []).filter((it) => it.is_deleted === "0")))
      .catch((err) => console.error("Gagal ambil data obat:", err));
  };

  useEffect(() => {
    getDataObat();
  }, []);

  // ✅ toggle modal aman
  const toggleModal = () => props.setModal((v) => !v);

  // ✅ handler dari Table baru
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
        view="obat"
        data={obat}
        cari={props.cari}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        stat={props.modal}
        setM={toggleModal}
        name={props.modalName}
        data={props.data}
        view="obat"
        title={
          props.modalName === "edit"
            ? "Edit data obat"
            : props.modalName === "delete"
            ? "Hapus data obat"
            : props.modalName === "insert" && "Tambah data obat"
        }
        onSubmit={(form) => {
          const formBody = new URLSearchParams();

          let endpoint = "";
          if (props.modalName === "insert") {
            // kirim semua field untuk insert
            // field yang dipakai Modal: nama_obat, kode_obat, kandungan, stock_obat, satuan
            for (const key in form) formBody.append(key, form[key] ?? "");
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=obat";
          } else if (props.modalName === "edit") {
            // kirim semua field + id untuk edit
            for (const key in form) formBody.append(key, form[key] ?? "");
            if (props.data?.id) formBody.set("id", props.data.id);
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_edit.php?type=obat";
          } else if (props.modalName === "delete") {
            // hapus: cukup kirim id + type
            if (props.data?.id) formBody.set("id", props.data.id);
            formBody.set("type", "obat");
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_hapus.php?type=obat";
          }

          return fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formBody.toString(),
          })
            .then(async (res) => {
              // beberapa endpoint kadang balas teks; coba parse aman
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
                getDataObat();
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

export default Obat;
