import { Table, Modal } from "../component/Component";
import { useState, useEffect } from "react";


function Siswa(props) {
  const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
  const [data, setData] = useState("");
  const [siswa, setSiswa] = useState([]);

  const getDataSiswa = () => {
    fetch("http://localhost/Project-UKS/backend/proses/tampil_data_siswa.php")
      .then(res => res.json())
      .then(data => setSiswa(data))
      .catch(err => console.error("Gagal ambil data siswa:", err));
  };


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
        data={siswa}
        name="data_siswa"
      />
      <Modal
        setM={funcModal}
        name={props.modalName}
        data={props.data}
        title={
          props.modalName === 'edit'
            ? 'Edit data siswa'
            : props.modalName === 'delete'
              ? 'Hapus data siswa'
              : props.modalName === 'insert' && 'Tambah data siswa'
        }
        stat={props.modal}
        onSubmit={(form) => {
          const formBody = new URLSearchParams();
          for (const key in form) {
            formBody.append(key, form[key]);
          }

          let endpoint = "";
          if (props.modalName === "insert") {
            endpoint = "http://localhost/Project-UKS/backend/proses/proses_tambah.php";
          } else if (props.modalName === "edit") {
            endpoint = "http://localhost/Project-UKS/backend/proses/proses_edit.php";
          } else if (props.modalName === "delete") {
            endpoint = "http://localhost/Project-UKS/backend/proses/proses_hapus.php";
            // Untuk hapus, biasanya hanya perlu kirim NIS
            formBody.delete("nis");
            formBody.delete("nama");
            formBody.delete("kelas");
            formBody.delete("tinggi_badan");
            formBody.delete("berat_badan");
            formBody.delete("golongan_darah");
            formBody.append("id", props.data.id);
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
                getDataSiswa();
                props.setModal(false);
                window.location.reload();
              }
            })
            .catch((err) => {
              console.error("Error:", err);
            });
        }}
      />
    </div>
  );
}
export default Siswa;
