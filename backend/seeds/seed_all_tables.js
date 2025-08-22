/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("tbl_transaksi_obat").del();
  await knex("tbl_kunjungan").del();
  await knex("tbl_obat").del();
  await knex("tbl_siswa").del();
  await knex("tbl_user").del();

  // Seed user
  await knex("tbl_user").insert([
    { id_user: 1, username: "operator", password: "admin", tipe_user: "Admin" },
    {
      id_user: 2,
      username: "aminnnn",
      password: "operator",
      tipe_user: "operator",
    },
  ]);

  // ✅ Seed siswa dengan 3 kelas berbeda
  await knex("tbl_siswa").insert([
    {
      id: 1,
      nama: "Budi Santoso",
      kelas: "X RPL",
      nis: 1001,
      tinggi_badan: 165,
      berat_badan: 55,
      golongan_darah: "A+",
    },
    {
      id: 2,
      nama: "Siti Aminah",
      kelas: "XI TKJ",
      nis: 1002,
      tinggi_badan: 158,
      berat_badan: 48,
      golongan_darah: "B+",
    },
    {
      id: 3,
      nama: "Andi Wijaya",
      kelas: "XII IPA",
      nis: 1003,
      tinggi_badan: 172,
      berat_badan: 62,
      golongan_darah: "O+",
    },
  ]);

  // Seed obat
  await knex("tbl_obat").insert([
    {
      id: 1,
      nama_obat: "Paracetamol",
      kode_obat: "OBT001",
      jenis_obat: "Tablet",
      kandungan: "Paracetamol 500mg",
      stock_obat: 100,
      satuan: "pcs",
    },
    {
      id: 2,
      nama_obat: "Amoxicillin",
      kode_obat: "OBT002",
      jenis_obat: "Kapsul",
      kandungan: "Amoxicillin 500mg",
      stock_obat: 80,
      satuan: "pcs",
    },
    {
      id: 3,
      nama_obat: "OBH Combi",
      kode_obat: "OBT003",
      jenis_obat: "Sirup",
      kandungan: "Dextromethorphan HBr 10mg",
      stock_obat: 60,
      satuan: "ml",
    },
    {
      id: 4,
      nama_obat: "Ibuprofen",
      kode_obat: "OBT004",
      jenis_obat: "Tablet",
      kandungan: "Ibuprofen 400mg",
      stock_obat: 90,
      satuan: "pcs",
    },
    {
      id: 5,
      nama_obat: "Vitamin C",
      kode_obat: "OBT005",
      jenis_obat: "Tablet",
      kandungan: "Vitamin C 500mg",
      stock_obat: 120,
      satuan: "pcs",
    },
    {
      id: 6,
      nama_obat: "CTM",
      kode_obat: "OBT006",
      jenis_obat: "Tablet",
      kandungan: "Chlorpheniramine Maleate 4mg",
      stock_obat: 70,
      satuan: "pcs",
    },
    {
      id: 7,
      nama_obat: "Metformin",
      kode_obat: "OBT007",
      jenis_obat: "Tablet",
      kandungan: "Metformin HCl 500mg",
      stock_obat: 85,
      satuan: "pcs",
    },
    {
      id: 8,
      nama_obat: "Salep Gentamicin",
      kode_obat: "OBT008",
      jenis_obat: "Salep",
      kandungan: "Gentamicin 0.1%",
      stock_obat: 40,
      satuan: "pcs",
    },
    {
      id: 9,
      nama_obat: "Antasida",
      kode_obat: "OBT009",
      jenis_obat: "Tablet",
      kandungan: "Aluminium Hydroxide & Mg Hydroxide",
      stock_obat: 95,
      satuan: "pcs",
    },
    {
      id: 10,
      nama_obat: "Cough Syrup",
      kode_obat: "OBT010",
      jenis_obat: "Sirup",
      kandungan: "Guaifenesin 100mg/5ml",
      stock_obat: 50,
      satuan: "ml",
    },
    {
      id: 11,
      nama_obat: "Omeprazole",
      kode_obat: "OBT011",
      jenis_obat: "Kapsul",
      kandungan: "Omeprazole 20mg",
      stock_obat: 65,
      satuan: "pcs",
    },
    {
      id: 12,
      nama_obat: "Salep Hidrokortison",
      kode_obat: "OBT012",
      jenis_obat: "Salep",
      kandungan: "Hydrocortisone 2.5%",
      stock_obat: 30,
      satuan: "pcs",
    },
  ]);

  // Seed kunjungan (pakai siswa id 1,2,3)
  await knex("tbl_kunjungan").insert([
    {
      id: 1,
      id_siswa: 1,
      keluhan: "Sakit kepala",
      tanggal: "2025-08-10 08:00:00",
      keterangan: "-",
    },
    {
      id: 2,
      id_siswa: 2,
      keluhan: "Demam",
      tanggal: "2025-08-11 09:30:00",
      keterangan: "-",
    },
    {
      id: 3,
      id_siswa: 3,
      keluhan: "Batuk",
      tanggal: "2025-08-12 10:15:00",
      keterangan: "-",
    },
  ]);

  // Seed transaksi obat (hubungkan kunjungan dengan obat)
  await knex("tbl_transaksi_obat").insert([
    {
      id: 1,
      id_kunjungan: 1,
      id_obat: 1,
      qty: 1,
      tanggal_kunjungan: "2025-08-10 08:00:00",
    },
    {
      id: 2,
      id_kunjungan: 2,
      id_obat: 2,
      qty: 2,
      tanggal_kunjungan: "2025-08-11 09:30:00",
    },
    {
      id: 3,
      id_kunjungan: 3,
      id_obat: 3,
      qty: 1,
      tanggal_kunjungan: "2025-08-12 10:15:00",
    },
  ]);
};
