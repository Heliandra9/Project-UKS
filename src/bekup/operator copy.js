import { useState, useEffect } from 'react';
import {
  FiPlus, FiSearch, FiUser, FiFileText, FiPieChart,
  FiSettings, FiLogOut, FiX
} from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Operator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('visitors');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', stock: 50 },
    { id: 2, name: 'Ibuprofen', stock: 30 },
    { id: 3, name: 'Antihistamine', stock: 25 },
    { id: 4, name: 'Oralit', stock: 40 },
    { id: 5, name: 'Vitamin C', stock: 60 },
  ]);
  const userType = localStorage.getItem("tipe_user");

  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    complaint: '',
    selectedMedicines: [],
    notes: ''
  });

  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (userType !== "operator") {
      navigate('/');
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki akses ke halaman ini.',
      })
    }
  }, []);

  const logot = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };

  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: 'Andi Wijaya',
        grade: '10 IPA 1',
        complaint: 'Sakit kepala dan demam',
        medicines: [
          { id: 1, name: 'Paracetamol', quantity: 1 },
          { id: 5, name: 'Vitamin C', quantity: 2 }
        ],
        date: '2023-05-15',
        notes: 'Istirahat cukup dan minum air putih'
      },
      {
        id: 2,
        name: 'Budi Santoso',
        grade: '11 IPS 2',
        complaint: 'Mual dan pusing',
        medicines: [
          { id: 2, name: 'Ibuprofen', quantity: 1 }
        ],
        date: '2023-05-16',
        notes: 'Hindari makanan pedas'
      }
    ];
    setStudents(sampleData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineSelect = (medicine) => {
    const existingIndex = formData.selectedMedicines.findIndex(m => m.id === medicine.id);
    if (existingIndex >= 0) {
      const updated = [...formData.selectedMedicines];
      updated.splice(existingIndex, 1);
      setFormData(prev => ({ ...prev, selectedMedicines: updated }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedMedicines: [...prev.selectedMedicines, { ...medicine, quantity: 1 }]
      }));
    }
  };

  const handleQuantityChange = (id, value) => {
    const updated = formData.selectedMedicines.map(m =>
      m.id === id ? { ...m, quantity: Math.max(1, Math.min(parseInt(value) || 1, m.stock)) } : m
    );
    setFormData(prev => ({ ...prev, selectedMedicines: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVisitor = {
      id: Date.now(),
      name: formData.studentName,
      grade: formData.grade,
      complaint: formData.complaint,
      medicines: formData.selectedMedicines,
      date: new Date().toISOString().split('T')[0],
      notes: formData.notes
    };

    setStudents(prev => [...prev, newVisitor]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      grade: '',
      complaint: '',
      selectedMedicines: [],
      notes: ''
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.complaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Kelola Pengunjung UKS</h2>

        <input
          type="text"
          placeholder="Cari nama siswa, kelas, atau keluhan..."
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="space-y-4">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white rounded-xl shadow p-4">
              <div className="font-bold text-indigo-700">{student.name}</div>
              <div className="text-sm text-gray-500">{student.grade}</div>
              <div className="mt-2 text-gray-800 text-sm">Keluhan: {student.complaint}</div>
              <div className="mt-1 text-gray-800 text-sm">Catatan: {student.notes}</div>
              <div className="mt-1 text-gray-500 text-xs">Tanggal: {student.date}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {student.medicines.map(med => (
                  <span key={med.id} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                    {med.name} ({med.quantity})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-20 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg"
        >
          <FiPlus size={24} />
        </button>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg w-11/12 p-6 relative max-w-md">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowAddModal(false)}
              >
                <FiX size={20} />
              </button>

              <h2 className="text-lg font-bold mb-4">Tambah Kunjungan</h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Nama Siswa"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="Kelas"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleInputChange}
                  placeholder="Keluhan"
                  required
                  className="w-full px-3 py-2 border rounded"
                />

                <div>
                  <label className="block font-semibold mb-1">Pilih Obat:</label>
                  <div className="flex flex-wrap gap-2">
                    {medicines.map(medicine => (
                      <button
                        type="button"
                        key={medicine.id}
                        onClick={() => handleMedicineSelect(medicine)}
                        className={`px-2 py-1 rounded text-sm border ${formData.selectedMedicines.some(m => m.id === medicine.id)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100'
                          }`}
                      >
                        {medicine.name}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.selectedMedicines.length > 0 && (
                  <div className="space-y-1">
                    {formData.selectedMedicines.map(med => (
                      <div key={med.id} className="flex justify-between items-center">
                        <span>{med.name}</span>
                        <input
                          type="number"
                          min="1"
                          max={med.stock}
                          value={med.quantity}
                          onChange={(e) => handleQuantityChange(med.id, e.target.value)}
                          className="w-16 px-2 py-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Catatan tambahan"
                  className="w-full px-3 py-2 border rounded"
                />

                <button
                  type="submit"
                  className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full flex justify-around bg-white border-t p-2 z-50">
        <button onClick={() => setActiveTab('visitors')} className={`flex flex-col items-center text-sm ${activeTab === 'visitors' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <FiUser size={20} />
          Pengunjung
        </button>
        <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center text-sm ${activeTab === 'reports' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <FiFileText size={20} />
          Laporan
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center text-sm ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <FiPieChart size={20} />
          Analisis
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center text-sm ${activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <FiSettings size={20} />
          Pengaturan
        </button>
      </div>
    </div>
  );
}

export default Operator;
