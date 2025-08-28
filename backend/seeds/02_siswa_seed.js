/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tbl_siswa').del()
  // Seed siswa
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
};
