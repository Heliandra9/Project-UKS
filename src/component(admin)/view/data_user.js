import { Table, Modal } from "../Component";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

function User(props) {
  const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
  const [data, setData] = useState("");
  const [user, setUser] = useState([]);

  const getDataUser = () => {
    fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=user")
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error("Gagal ambil data User:", err));
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const funcModal = () => {
    if (props.setModal) {
      props.setModal(!props.modal);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <Table
        setM={funcModal}
        cari={props.cari}
        funcName={props.setModalName}
        setData={props.setData}
        data={user}
        name="data_User"
        view={props.view}
      />

      <Modal
        setM={funcModal}
        name={props.modalName}
        data={props.data}
        title={
          props.modalName === 'edit'
            ? 'Edit data User'
            : props.modalName === 'delete'
              ? 'Hapus data User'
              : props.modalName === 'insert' && 'Tambah data User'
        }
        stat={props.modal}
        onSubmit={(form) => {
          const formBody = new URLSearchParams();
          for (const key in form) {
            formBody.append(key, form[key]);
          }

          let endpoint = "";
          if (props.modalName === "insert") {
            endpoint = "http://localhost/amin/Project-UKS/backend/proses/proses_tambah.php?type=user";
          } else if (props.modalName === "edit") {
            endpoint = "http://localhost/amin/Project-UKS/backend/proses/proses_edit.php?type=user";
            formBody.append("id", props.data.id_user); // pastikan props.data.id tersedia
          } else if (props.modalName === "delete") {

            endpoint = "http://localhost/amin/Project-UKS/backend/proses/proses_hapus.php";
            formBody.set("id", props.data.id_user); // gunakan ID sebagai identifier
            formBody.set("type", "user"); // <-- Tambahkan ini


          }

          fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.toString()
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.status === "success") {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil!',
                  text: props.modalName === 'edit'
                    ? 'Data berhasil diubah'
                    : props.modalName === 'delete'
                      ? 'Data berhasil dihapus'
                      : 'Data berhasil ditambahkan',
                  timer: 1500,
                  showConfirmButton: false
                });
                getDataUser();
                props.setModal(false);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Gagal!',
                  text: result.message || 'Terjadi kesalahan',
                  showConfirmButton: true
                });
              }
            })
            .catch((err) => {
              console.error("Error:", err);
            });
            
          console.log(formBody.toString());
        }}
        view={props.view}
      />
    </div>
  );
}

export default User;
