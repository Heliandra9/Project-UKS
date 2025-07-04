import { Table, Modal } from "../component/Component";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';


function Siswa(props) {
  const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
  const [data, setData] = useState("");
  const [siswa, setSiswa] = useState([]);

  const getDataSiswa = () => {
    fetch("http://localhost/pkl/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then(res => res.json())
      .then(data => {
        console.log("DATA SISWA:", data); // Tambahkan ini
        setSiswa(data);
      })
      .catch(err => console.error("Gagal ambil data siswa:", err));
  };

  useEffect(() => {
    getDataSiswa();
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
        data={siswa}
        name="data_siswa"
        view={props.view} // <-- tambahkan ini
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
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_tambah.php?type=siswa";
          } else if (props.modalName === "edit") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_edit.php";
          } else if (props.modalName === "delete") {
            endpoint = "http://localhost/pkl/Project-UKS/backend/proses/proses_hapus.php?type=siswa";
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
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil!',
                  text: props.name === 'edit'
                    ? 'Data berhasil diubah'
                    : props.name === 'delete'
                      ? 'Data berhasil dihapus'
                      : 'Data berhasil ditambahkan',
                  timer: 1500,
                  showConfirmButton: false
                });
                // Refresh data dan tutup modal
                getDataSiswa && getDataSiswa();
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
        }}
        view={props.view} // <-- tambahkan ini
      />
    </div>
  );
}
export default Siswa;
