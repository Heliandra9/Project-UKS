import { useState } from "react";
import {Table, Modal} from "../component/Component";


function Obat(props){
      const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
      const [data, setData] = useState("");
      const [siswa, setSiswa] = useState([]);
    
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
        name="data_obat"
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
      />
    </div>
    );
}
export default Obat;