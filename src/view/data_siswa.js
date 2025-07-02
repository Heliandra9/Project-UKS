import {Table, Modal} from "../component/Component";
import { useState } from "react";

function Siswa(props) {
  const [modalName, setModalName] = useState(props.modalName ? "insert" : "");
  const [data, setData] = useState("");


  const funcModal = () => {
    if (props.setModal) {
      props.setModal(!props.modal);
    }
  };

  return (
    <div className="w-full h-screen flex">
        <Table setM={funcModal} cari={props.cari} funcName={setModalName} setData={setData}/>
        <Modal
          setM={funcModal}
          name={modalName}
          data={data}
          title={
            modalName === 'edit'
              ? 'Edit data siswa'
              : modalName === 'delete'
              ? 'Hapus data siswa'
              : props.modalName === 'insert' && 'Tambah data siswa'
          }
          stat={props.modal}
        />
    </div>
  );
}
export default Siswa;
