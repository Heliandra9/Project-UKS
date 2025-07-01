import {Table, Modal} from "../component/Component";
import { useState } from "react";

function Siswa() {
  const [modal, setModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const funcModal = () => {
    setModal(!modal);
  };
  const [data, setData] = useState();
  return (
    <div className="w-full h-screen flex">
        <Table setM={funcModal} funcName={setModalName} setData={setData}/>
        <Modal setM={funcModal} name={modalName} data={data} title={modalName === 'edit' ? 'Edit data siswa' :modalName === 'delete' && 'Hapus data siswa'} stat={modal}/>
    </div>
  );
}
export default Siswa;
