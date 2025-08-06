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
      navigate('/'); // arahkan ke halaman home atau login
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
        selectedMedicines: [
          ...prev.selectedMedicines,
          { ...medicine, quantity: 1 }
        ]
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
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-4 flex flex-col">
        <div className="flex items-center mb-8 mt-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
            <span className="text-indigo-600 font-bold text-xl">UKS</span>
          </div>
          <h1 className="text-xl font-bold">UKS Management</h1>
        </div>

        <nav className="flex-1">
          <button onClick={() => setActiveTab('visitors')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'visitors' ? 'bg-white text-indigo-600' : 'hover:bg-indigo-500'}`}>
            <FiUser className="mr-3" /> Pengunjung
          </button>
          <button onClick={() => setActiveTab('reports')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'reports' ? 'bg-white text-indigo-600' : 'hover:bg-indigo-500'}`}>
            <FiFileText className="mr-3" /> Laporan
          </button>
          <button onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600' : 'hover:bg-indigo-500'}`}>
            <FiPieChart className="mr-3" /> Analisis
          </button>
          <button onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600' : 'hover:bg-indigo-500'}`}>
            <FiSettings className="mr-3" /> Pengaturan
          </button>
        </nav>

        <button className="flex items-center p-3 rounded-lg hover:bg-indigo-500 mt-auto" onClick={logot}>
          <FiLogOut className="mr-3" /> Keluar
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Kelola Pengunjung UKS</h2>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all">
              <FiPlus className="mr-2" /> Tambah Pengunjung
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari nama siswa, kelas, atau keluhan..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keluhan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{student.grade}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{student.complaint}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {student.medicines.map(med => (
                            <span key={med.id} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                              {med.name} ({med.quantity})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{student.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{student.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tambah Data Pengunjung</h3>
                <button onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Siswa</label>
                    <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                    <input type="text" name="grade" value={formData.grade} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan</label>
                  <textarea name="complaint" value={formData.complaint} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3} required />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resep Obat</label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.selectedMedicines.map(med => (
                        <div key={med.id} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                          <span className="mr-2">{med.name}</span>
                          <input type="number" min="1" max={med.stock}
                            value={med.quantity}
                            onChange={(e) => handleQuantityChange(med.id, e.target.value)}
                            className="w-12 text-center bg-transparent border-b border-indigo-300 focus:outline-none" />
                          <button type="button" onClick={() => handleMedicineSelect(med)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto">
                      {medicines.map(medicine => (
                        <div key={medicine.id}
                          onClick={() => handleMedicineSelect(medicine)}
                          className={`p-2 rounded cursor-pointer ${formData.selectedMedicines.some(m => m.id === medicine.id)
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'hover:bg-gray-100'
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{medicine.name}</span>
                            <span className="text-xs text-gray-500">Stok: {medicine.stock}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operator;
