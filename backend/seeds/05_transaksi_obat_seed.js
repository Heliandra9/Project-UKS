/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("tbl_transaksi_obat").del();

  // Ambil semua kunjungan
  const kunjungan = await knex("tbl_kunjungan").select("id");

  const data = [];
  const obatIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // id_obat yang tersedia
  const petugasList = ["Admin", "Petugas UKS", "Gudang"];

  // Range tahun dan bulan untuk randomisasi
  const START_YEAR = 2024;
  const END_YEAR = 2025;

  kunjungan.forEach((k, i) => {
    // Tentukan jumlah obat untuk transaksi ini (2–3 obat per kunjungan)
    const jumlahObat = (i % 2) + 2; // hasilnya 2 atau 3

    for (let j = 0; j < jumlahObat; j++) {
      const jenisTransaksi = j % 2 === 0 ? "Keluar" : "Masuk"; // variasi masuk/keluar
      const randomPetugas = petugasList[Math.floor(Math.random() * petugasList.length)];

      // Random tanggal
      const year = START_YEAR + Math.floor(Math.random() * (END_YEAR - START_YEAR + 1));
      const month = Math.floor(Math.random() * 12); // 0 = Jan, 11 = Dec
      const day = Math.floor(Math.random() * 28) + 1; // 1–28 untuk aman
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);

      const createdAt = new Date(year, month, day, hour, minute, second);

      data.push({
        id_kunjungan: k.id,
        id_obat: obatIds[(i + j) % obatIds.length],
        qty: Math.floor(Math.random() * 3) + 1, // 1–3
        jenis_transaksi: jenisTransaksi,
        keterangan: jenisTransaksi === "Masuk" ? "Stok masuk" : "Pemberian obat ke siswa",
        petugas: randomPetugas,
        created_at: createdAt,
        updated_at: createdAt,
      });
    }
  });

  if (data.length > 0) {
    await knex("tbl_transaksi_obat").insert(data);
  }

  console.log(`✅ Seed tbl_transaksi_obat selesai. Total data: ${data.length}`);
};
