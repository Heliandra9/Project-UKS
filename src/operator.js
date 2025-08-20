import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// Data dummy produk obat-obatan
const produk = [
  {
    id: 1,
    nama: "Paracetamol",
    harga: 5000,
    stok: 20,
    gambar: "paracetamol.png",
    id_kategori: 1,
  },
  {
    id: 2,
    nama: "Amoxicillin",
    harga: 12000,
    stok: 15,
    gambar: "amoxicillin.png",
    id_kategori: 1,
  },
  {
    id: 3,
    nama: "Vitamin C",
    harga: 8000,
    stok: 30,
    gambar: "vitaminc.png",
    id_kategori: 2,
  },
  {
    id: 4,
    nama: "OBH Combi",
    harga: 10000,
    stok: 10,
    gambar: "obhcombi.png",
    id_kategori: 3,
  },
  {
    id: 5,
    nama: "Antasida",
    harga: 7000,
    stok: 25,
    gambar: "antasida.png",
    id_kategori: 4,
  },
  {
    id: 6,
    nama: "Betadine",
    harga: 9000,
    stok: 12,
    gambar: "betadine.png",
    id_kategori: 5,
  },
];
// Data dummy kategori
const kategori = [
  { id: 1, nama_kategori: "Obat Demam" },
  { id: 2, nama_kategori: "Vitamin" },
  { id: 3, nama_kategori: "Obat Batuk" },
  { id: 4, nama_kategori: "Obat Maag" },
  { id: 5, nama_kategori: "Antiseptik" },
];
// Data dummy member
const saran = [
  { id: 1, nama: "Budi", diskon: 10, saldo: 20000 },
  { id: 2, nama: "Siti", diskon: 5, saldo: 15000 },
  { id: 3, nama: "Andi", diskon: 0, saldo: 5000 },
];

// Data obat 

export default function Operator() {
  const [obat, setObat] = useState([]);

  const getDataObat = () => {
    fetch("http://localhost/amin/Project-UKS/backend/proses/tampil_data.php?type=obat")
      .then(res => res.json())
      .then(data => {
        setObat(data);
        console.log(data);
      })
      .catch(err => console.error("Gagal ambil data obat:", err));
  }
  useEffect(() => {
    getDataObat();
  }, []);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const logot = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("tipe_user");
    localStorage.removeItem("view");
    localStorage.setItem("showLogoutSuccess", "true");
    navigate("/");
  };
  const [showLogout, setShowLogout] = useState(false);
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };
  const scrollRef = useRef(null);

  const [statusNabung, setStatusNabung] = useState("Deposit");

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  // loading screen
  const [loading, setLoading] = useState(false);

  // untuk simulasi qr code
  const handleKonfirmasiPembayaran = () => {
    setShowNonTunaiModal(false);

    // Tampilkan loading dari SweetAlert
    Swal.fire({
      title: "Menyimpan transaksi...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalTambahMember, setShowModalTambahMember] = useState(false);
  const [showNonTunaiModal, setShowNonTunaiModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const filterNamaObat = obat.filter((item) => {
    const matchNama = (item.nama ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchKategori = true;

    if (selectedKategori !== "semua") {
      if (item.id_kategori === selectedKategori) {
        matchKategori = true;
      } else {
        alert(`false`);
        matchKategori = false;
      }
    }

    return matchNama && matchKategori;
  });

  // Data transaksi: array JS biasa
  const [transaksi, setTransaksi] = useState([]);

  // Tambah produk ke transaksi
  const tambahTransaksi = (obat) => {
    setTransaksi((prev) => {
      const index = prev.findIndex((item) => item.obat.id === obat.id);
      let increment = 1;
      if (index !== -1) {
        const item = prev[index];
        const parts = item.obat.stock_dengan_satuan?.split(" ") || [];
        const stok = parts[0] ? parseInt(parts[0], 10) : 0;
        const satuan = parts[1] ? parts[1].toLowerCase() : "";
        increment = satuan === "ml" ? 5 : 1;
        if (item.qty + increment > stok) {
          Swal.fire({
            icon: "error",
            title: "Stok tidak cukup",
            text: "Jumlah Obat melebihi stok yang tersedia",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return prev;
        }
        const update = [...prev];
        update[index] = { ...item, qty: item.qty + increment };
        // Update juga state quantities
        setQuantities((q) => ({
          ...q,
          [item.obat.id]: (q[item.obat.id] || item.qty) + increment,
        }));
        return update;
      } else {
        const parts = obat.stock_dengan_satuan?.split(" ") || [];
        const stok = parts[0] ? parseInt(parts[0], 10) : 0;
        const satuan = parts[1] ? parts[1].toLowerCase() : "";
        increment = satuan === "ml" ? 5 : 1;
        if (stok < increment) {
          Swal.fire({
            icon: "error",
            title: "Stok tidak cukup",
            text: "Obat ini sedang habis stok",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return prev;
        }
        // Update juga state quantities
        setQuantities((q) => ({
          ...q,
          [obat.id]: increment,
        }));
        return [...prev, { obat, qty: increment }];
      }
    });
  };


  // Quantities state (JS only)
  const [quantities, setQuantities] = useState({});
  const updateQuantity = (obatId, newQty) => {
    const finalQty = Math.max(0, newQty);
    if (finalQty === 0) {
      setTransaksi((prev) =>
        prev.filter((item) => item.obat.id !== obatId)
      );
      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[obatId];
        return newQuantities;
      });
    } else {
      setQuantities((prev) => ({ ...prev, [obatId]: finalQty }));
      setTransaksi((prev) =>
        prev.map((item) =>
          item.obat.id === obatId ? { ...item, qty: finalQty } : item
        )
      );
    }
  };
  useEffect(() => {
    if (localStorage.getItem("tipe_user") !== "operator") {
      window.location.href = "/login";
    }
  });

  return (
    <div className="flex h-screen w-full bg-gray-600 flex-col gap-4">
      <div className={`flex justify-between pt-4 px-4 bg-gray-800 py-4`}>
        <div className="w-1/6 items-center flex">
          <h1 className="text-2xl font-bold text-white">Point Of Sale</h1>
        </div>
        <div className={`flex gap-4 w-full justify-end`}>
          <div
            onClick={toggleLogout}
            className={`text-white flex items-center relative cursor-pointer`}
          >
            {localStorage.getItem("username")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`size-4 ml-2 ${showLogout ? "rotate-180" : ""
                } transition-transform duration-150 ease-in-out`}
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
            {showLogout && (
              <div
                className={`transition-all duration-150 ease-in-out absolute top-8 right-0 bg-red-500 cursor-pointer hover:opacity-50 rounded-md shadow-lg p-0 w-36 z-20 animate-fade-in`}
              >
                <ul className="text-white m-0 p-0">
                  <li className="py-2 px-2 cursor-pointer transition-colors rounded-md">
                    <button
                      onClick={logot}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`flex h-full p-4 w-full`}>
        <div className={`w-4/6 h-full bg-white rounded-lg p-4`}>
          <div className={`flex items-center mb-4`}>
            <div className={`relative w-full`}>
              <input
                type="text"
                placeholder="Cari Produk"
                className={`border-gray-500 border p-2 focus:outline-none rounded-full w-full`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 font-bold text-red-500 absolute right-2 top-2 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={`ml-2 flex justify-end items-center`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-red-500 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className={`text-red-500`}>Back</p>
            </div>
          </div>
          <div className={`flex gap-4`}>
            <div
              onClick={scrollLeft}
              className={`rounded-full active:opacity-50 py-1 mb-4 text-red-500 border border-red-500 cursor-pointer select-none`}
              title="Scroll Left"
            >
              {/* Tombol scroll left (panah kiri) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7 7-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 19l-7-7 7-7"
                />
              </svg>
            </div>

            <div
              ref={scrollRef}
              className={`overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-grow`}
            >
              <div className="flex gap-2 mb-4">
                <button
                  className={`px-3 py-1 rounded ${selectedKategori === "semua"
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                    }`}
                  onClick={() => setSelectedKategori("semua")}
                >
                  Semua
                </button>
                {kategori.map((kat) => (
                  <button
                    key={kat.id}
                    className={`px-3 py-1 rounded w-fit ${selectedKategori === kat.id
                      ? "bg-red-500 text-white"
                      : "bg-gray-300"
                      }`}
                    onClick={() => setSelectedKategori(kat.id)}
                  >
                    {kat.nama_kategori}
                  </button>
                ))}
              </div>
            </div>

            <div
              onClick={scrollRight}
              className={`rounded-full active:opacity-50 py-1 mb-4 text-red-500 border border-red-500 cursor-pointer select-none`}
              title="Scroll Right"
            >
              {/* Tombol scroll right (panah kanan) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 5l7 7-7 7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
          <div
            className={`grid grid-cols-6 gap-4 mt-4 p-2 [scrollbar-width:thin] overflow-y-auto max-h-[375px] overflow-x-hidden`}
          >
            {filterNamaObat && filterNamaObat.length > 0 ? (
              filterNamaObat.map((item) => (
                <div
                  key={item.id}
                  onClick={() => tambahTransaksi(item)}
                  className={`flex flex-col rounded-sm border hover:scale-105 hover:shadow-md hover:shadow-gray-500 transition-all duration-300 ease-in-out cursor-pointer border-gray-300 w-[120px] h-[160px]`}
                >
                  <img
                    src={`/logo/${item.gambar}`}
                    alt={item.nama_obat}
                    className={`object-cover w-full h-20 rounded-t-sm`}
                  />
                  <div className={`p-2 rounded-b-sm`}>
                    <p
                      className={`text-gray-600 text-sm font-semibold truncate`}
                    >
                      {item.nama_obat}
                    </p>
                    <p className={`text-gray-600 text-xs`}>Stok: {item.stock_dengan_satuan}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-6 flex justify-center items-center w-full h-[350px]">
                <p className="text-black text-center">Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 flex-1 relative overflow-x-auto shadow-md sm:rounded-lg bg-white h-full w-full">
          <div className={`flex items-center my-2 px-2 gap-2`}>
            {/* Input member dummy, tombol member/nabung di-nonaktifkan */}
            <input
              type="text"
              placeholder="Member (dummy)"
              className="rounded-sm bg-white text-black w-full py-4 border-slate-300 border placeholder-gray-500 px-2 focus:outline-0"
              disabled
            />
            <div className="flex flex-col w-3/6 gap-2">
              <button
                className="flex w-full justify-center bg-blue-300 text-white border border-blue-300 rounded-sm items-center px-4 cursor-not-allowed opacity-50"
                disabled
              >
                Member&nbsp;baru
              </button>
              <button
                className="flex w-full justify-center bg-green-300 text-white border border-green-300 rounded-sm items-center px-4 cursor-not-allowed opacity-50"
                disabled
              >
                Nabung
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto h-[330px]">
            <table className="min-w-full table-fixed text-sm text-left text-black">
              <thead className="text-xs text-black uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 w-1/5">
                    Nama Obat
                  </th>
                  <th scope="col" className="px-4 py-3 w-1/5 text-center">
                    Qty
                  </th>
                </tr>
              </thead>
              <tbody>
                {transaksi.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-black whitespace-normal truncate overflow-hidden max-w-40"
                    >
                      {item.obat.nama_obat}
                    </th>
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="flex items-center w-full">
                        <svg
                          onClick={() => {
                            const parts = item.obat.stock_dengan_satuan?.split(" ") || [];
                            const satuan = parts[1]?.toLowerCase() || "";
                            const step = satuan === "ml" ? 5 : 1;
                            updateQuantity(
                              item.obat.id,
                              (quantities[item.obat.id] || item.qty) - step
                            )
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="cursor-pointer size-4 mr-2"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-center text-sm">
                          {item.qty}{" "}
                          {item.obat.stock_dengan_satuan?.split(" ")[1] || "pcs"}
                        </p>
                        <svg
                          onClick={() => {
                            const parts = item.obat.stock_dengan_satuan?.split(" ") || [];
                            const stok = parts[0] ? parseInt(parts[0], 10) : 0; // stok angka
                            const satuan = parts[1]?.toLowerCase() || "";
                            const step = satuan === "ml" ? 5 : 1;

                            const currentQty = quantities[item.obat.id] || item.qty;

                            if (currentQty + step > stok) {
                              Swal.fire({
                                icon: "error",
                                title: "Stok tidak cukup",
                                text: "Jumlah Obat melebihi stok yang tersedia",
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                              });
                              return; // hentikan update
                            }

                            updateQuantity(item.obat.id, currentQty + step);

                          }}

                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4 cursor-pointer ml-2"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-100 absolute bottom-0 left-0 items-center justify-center m-4 ">
            <div className="flex mb-4">
              <div className="flex justify-center items-center w-1/2 text-black">
                <input
                  type="radio"
                  id="method"
                  name="method"
                  className="mr-2"
                  checked={selectedPayment === "tunai"}
                  onChange={() => setSelectedPayment("tunai")}
                />
                Tunai
              </div>
              <div className="justify-center flex w-1/2 text-black">
                <input
                  type="radio"
                  id="method"
                  name="method"
                  className="mr-2"
                  checked={selectedPayment === "non-tunai"}
                  onChange={() => setSelectedPayment("non-tunai")}
                />
                Non Tunai
              </div>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md"
              onClick={() => {
                // Aksi berdasarkan metode pembayaran
                if (selectedPayment === "tunai") {
                  setShowModal(true);
                } else if (selectedPayment === "non-tunai") {
                  setShowNonTunaiModal(true);
                }
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="flex flex-col items-center text-white text-xl">
          <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          Memproses Transaksi...
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                PEMBAYARAN Tunai
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 flex justify-center items-center"
                onClick={() => {
                  setSelectedPayment("");
                  // setTransaksi([]);
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showNonTunaiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                PEMBAYARAN Non Tunai
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 flex justify-center items-center"
                onClick={() => {
                  setShowNonTunaiModal(false);
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
