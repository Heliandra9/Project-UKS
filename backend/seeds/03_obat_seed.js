/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tbl_obat').del()
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
};
