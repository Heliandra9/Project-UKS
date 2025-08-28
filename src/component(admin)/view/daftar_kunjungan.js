import { useState, useEffect } from "react";
import { Table, Modal } from "../Component";
import Swal from 'sweetalert2';

function Kunjungan(props) {
  const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
  const [kunjungan, setKunjungan] = useState("");
  const [siswa, setSiswa] = useState([]);
  const [obat, setDataObat] = useState([]);
  const [form, setForm] = useState({ obat: [] });
  const [error, setError] = useState({});

  // Ambil data obat & set form awal
  useEffect(() => {
    if (props.view === "kunjungan") {
      fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=obat")
        .then((res) => res.json())
        .then((data) => setDataObat(data))
        .catch((err) => console.error("Gagal ambil data obat:", err));
    }
    // form awal
    if (props.view === "kunjungan") {
      setForm({ ...(props.data || {}), obat: props.data?.obat || [] });
    } else {
      setForm(props.data || {});
    }
  }, [props.data, props.statE]);

  const getDataKunjungan = () => {
    fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=kunjungan")
      .then(res => res.json())
      .then(data => {
        setKunjungan(data);
        console.log(data)
      })
      .catch(err => console.error("Gagal ambil data kunjungan:", err));
  }
  const getDataSiswa = () => {
    fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=siswa")
      .then(res => res.json())
      .then(data => {
        setSiswa(data);
      })
      .catch(err => console.error("Gagal ambil data kunjungan:", err));
  }
  useEffect(() => {
    getDataKunjungan();
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
        data={kunjungan}
        name="data_kunjungan"
        view={props.view}
      />
      <Modal
        setM={funcModal}
        name={props.modalName}
        data={props.data}
        siswa={siswa}
        obat={obat}
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        title={
          props.modalName === 'edit'
            ? 'Edit data kunjungan'
            : props.modalName === 'delete'
              ? 'Hapus data kunjungan'
              : props.modalName === 'insert' && 'Tambah data kunjungan'
        }
        stat={props.modal}
        onSubmit={(form) => {
          const formBody = new URLSearchParams();

          for (const key in form) {
            if (key === "obat") {
              formBody.append(key, JSON.stringify(form[key]));
            } else {
              formBody.append(key, form[key]);
            }
          }

          let endpoint = "";
          if (props.modalName === "insert") {
            endpoint = "http://localhost/amin/Project-UKS/backend/proses/proses_tambah.php?type=kunjungan";
          } else if (props.modalName === "edit") {
            endpoint = "http://localhost/amin/Project-UKS/backend/proses/proses_edit.php";
          } else if (props.modalName === "delete") {
            endpoint = "http://localhost/amin/Project-UKS/backend/proses/proses_hapus.php?type=kunjungan";
            formBody.delete("kode_kunjungan");
            formBody.delete("nama_kunjungan");
            formBody.delete("jenis_kunjungan");
            formBody.delete("kandungan");
            formBody.delete("stock_kunjungan");
            formBody.append("id", props.data.id);
          }
          formBody.append("type", "kunjungan");


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
                      : result.message,
                  timer: 1500,
                  showConfirmButton: false
                });
                // Refresh data dan tutup modal

                getDataKunjungan && getDataKunjungan();
                props.setModal(false);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Gagal!',
                  text: result.message || 'Terjadi kesalahan',
                  showConfirmButton: true
                });
              }
              console.log("Data obat dikirim:", result);
            })
            .catch(err => console.error("Fetch error:", err));
            console.log("Body form dikirim:", formBody.toString());
            
        }}
        view={props.view}
      />
    </div>
  );
}
export default Kunjungan;