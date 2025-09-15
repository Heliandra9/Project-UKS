/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("tbl_kunjungan").del();

  const data = [];
  let id = 1;
  const siswaIds = [1, 2, 3]; // contoh id siswa
  const keluhanList = [
    "Sakit kepala",
    "Demam",
    "Batuk",
    "Sakit perut",
    "Pusing",
    "Mual",
    "Sakit gigi",
    "Demam tinggi",
    "Pilek",
    "Keseleo",
    "Luka ringan",
  ];

  const startDate = new Date("2023-01-01"); // tanggal awal
  const endDate = new Date("2025-09-09");   // tanggal terbaru

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // 1–3 kunjungan per hari
    const kunjunganPerHari = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < kunjunganPerHari; i++) {
      const randomSiswa = siswaIds[Math.floor(Math.random() * siswaIds.length)];
      const randomKeluhan = keluhanList[Math.floor(Math.random() * keluhanList.length)];
      const jam = String(8 + i).padStart(2, "0"); // 08, 09, 10...
      const menit = String(Math.floor(Math.random() * 60)).padStart(2, "0");

      data.push({
        id: id++,
        id_siswa: randomSiswa,
        keluhan: randomKeluhan,
        tanggal: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${jam}:${menit}:00`,
      });
    }
  }

  await knex("tbl_kunjungan").insert(data);
};
