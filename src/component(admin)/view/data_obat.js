import { useState, useEffect } from "react";
import { Table, Modal } from "../Component";
import Swal from 'sweetalert2';

function Obat(props) {
  const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
  const [obat, setObat] = useState([]);

  const getDataObat = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=obat")
      .then(res => res.json())
      .then(data => {
        const aktif = data.filter(item => item.is_deleted === "0");
        setObat(aktif);
      })

      .catch(err => console.error("Gagal ambil data obat:", err));
  }
  useEffect(() => {
    getDataObat();
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
        data={obat}
        name="data_obat"
        view={props.view}
      />
      <Modal
        setM={funcModal}
        name={props.modalName}
        data={props.data}
        title={
          props.modalName === 'edit'
            ? 'Edit data obat'
            : props.modalName === 'delete'
              ? 'Hapus data obat'
              : props.modalName === 'insert' && 'Tambah data obat'
        }
        stat={props.modal}
        onSubmit={(form) => {
          const formBody = new URLSearchParams();
          for (const key in form) {
            formBody.append(key, form[key]);
          }

          let endpoint = "";
          if (props.modalName === "insert") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=obat";
          } else if (props.modalName === "edit") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_edit.php";
          } else if (props.modalName === "delete") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_hapus.php?type=obat";
            formBody.delete("kode_obat");
            formBody.delete("nama_obat");
            formBody.delete("satuan");
            formBody.delete("kandungan");
            formBody.delete("stock_obat");
            formBody.append("id", props.data.id);
          }
          formBody.append("type", "obat");


          fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formBody.toString()
          })
            .then(res => res.text())
            .then(text => {
              console.log("Response asli:", text);
              let result;
              try {
                result = JSON.parse(text);
              } catch (e) {
                throw new Error("Response bukan JSON");
              }
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


                getDataObat && getDataObat();
                props.setModal(false);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Gagal!',
                  text: result.message || 'Terjadi kesalahan',
                  showConfirmButton: true
                });
              }
              console.log(result)
            })
            .catch(err => console.error("Fetch error:", err));
        }}
        view={props.view}
      />
    </div>
  );
}
export default Obat;