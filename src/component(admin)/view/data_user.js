import { Table, Modal } from "../Component";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function User(props) {
  const [user, setUser] = useState([]);

  const getDataUser = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=user")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Gagal ambil data User:", err));
  };

  useEffect(() => {
    getDataUser();
  }, []);

  // Toggle modal pakai functional update agar tidak race condition
  const toggleModal = () => props.setModal((v) => !v);

  // Handler tombol di Table baru
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

  return (
    <div className="w-full min-h-screen flex">
      <Table
        view="user"
        data={user}
        cari={props.cari}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        stat={props.modal}
        setM={toggleModal}
        name={props.modalName}
        data={props.data}
        view="user"
        title={
          props.modalName === "edit"
            ? "Edit data User"
            : props.modalName === "delete"
            ? "Hapus data User"
            : props.modalName === "insert" && "Tambah data User"
        }
        onSubmit={(form) => {
          // siapkan body sesuai operasi
          const formBody = new URLSearchParams();

          if (props.modalName === "delete") {
            // kirim minimal ID + type
            if (props.data?.id_user) {
              formBody.set("id", props.data.id_user);
              formBody.set("id_user", props.data.id_user); // jaga-jaga kalau backend baca id_user
            }
            formBody.set("type", "user");
          } else {
            // insert / edit → kirim semua field
            for (const key in form) formBody.append(key, form[key] ?? "");
            // untuk edit wajib kirim id
            if (props.modalName === "edit" && props.data?.id_user) {
              formBody.set("id", props.data.id_user);
              formBody.set("id_user", props.data.id_user);
            }
          }

          // pilih endpoint
          let endpoint = "";
          if (props.modalName === "insert") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=user";
          } else if (props.modalName === "edit") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_edit.php?type=user";
          } else if (props.modalName === "delete") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_hapus.php";
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
                getDataUser();
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

export default User;
