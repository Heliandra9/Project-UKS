/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("tbl_transaksi_obat").del();

  await knex("tbl_transaksi_obat").insert([
    { id: 1, id_kunjungan: 1, id_obat: 1, qty: 1, tanggal_kunjungan: "2025-08-01 08:00:00" },
    { id: 2, id_kunjungan: 2, id_obat: 2, qty: 2, tanggal_kunjungan: "2025-08-02 09:30:00" },
    { id: 3, id_kunjungan: 3, id_obat: 3, qty: 1, tanggal_kunjungan: "2025-08-03 10:15:00" },
    { id: 4, id_kunjungan: 4, id_obat: 4, qty: 1, tanggal_kunjungan: "2025-08-04 11:00:00" },
    { id: 5, id_kunjungan: 5, id_obat: 5, qty: 1, tanggal_kunjungan: "2025-08-05 13:20:00" },
    { id: 6, id_kunjungan: 6, id_obat: 6, qty: 1, tanggal_kunjungan: "2025-08-06 14:45:00" },
    { id: 7, id_kunjungan: 7, id_obat: 7, qty: 1, tanggal_kunjungan: "2025-08-07 08:10:00" },
    { id: 8, id_kunjungan: 8, id_obat: 8, qty: 1, tanggal_kunjungan: "2025-08-08 09:50:00" },
    { id: 9, id_kunjungan: 9, id_obat: 9, qty: 1, tanggal_kunjungan: "2025-08-09 10:30:00" },
    { id: 10, id_kunjungan: 10, id_obat: 10, qty: 1, tanggal_kunjungan: "2025-08-10 08:20:00" },
    { id: 11, id_kunjungan: 11, id_obat: 11, qty: 1, tanggal_kunjungan: "2025-08-11 09:25:00" },
    { id: 12, id_kunjungan: 12, id_obat: 12, qty: 1, tanggal_kunjungan: "2025-08-12 11:40:00" },
    { id: 13, id_kunjungan: 13, id_obat: 1, qty: 1, tanggal_kunjungan: "2025-08-13 08:55:00" },
    { id: 14, id_kunjungan: 14, id_obat: 2, qty: 1, tanggal_kunjungan: "2025-08-14 10:05:00" },
    { id: 15, id_kunjungan: 15, id_obat: 3, qty: 1, tanggal_kunjungan: "2025-08-15 13:15:00" },
    { id: 16, id_kunjungan: 16, id_obat: 4, qty: 1, tanggal_kunjungan: "2025-08-16 08:35:00" },
    { id: 17, id_kunjungan: 17, id_obat: 5, qty: 1, tanggal_kunjungan: "2025-08-17 09:45:00" },
    { id: 18, id_kunjungan: 18, id_obat: 6, qty: 1, tanggal_kunjungan: "2025-08-18 10:25:00" },
    { id: 19, id_kunjungan: 19, id_obat: 7, qty: 1, tanggal_kunjungan: "2025-08-19 08:15:00" },
    { id: 20, id_kunjungan: 20, id_obat: 8, qty: 1, tanggal_kunjungan: "2025-08-20 09:55:00" },
    { id: 21, id_kunjungan: 21, id_obat: 9, qty: 1, tanggal_kunjungan: "2025-08-21 10:45:00" },
    { id: 22, id_kunjungan: 22, id_obat: 10, qty: 1, tanggal_kunjungan: "2025-08-22 08:25:00" },
    { id: 23, id_kunjungan: 23, id_obat: 11, qty: 1, tanggal_kunjungan: "2025-08-23 09:35:00" },
    { id: 24, id_kunjungan: 24, id_obat: 12, qty: 1, tanggal_kunjungan: "2025-08-24 11:10:00" },
    { id: 25, id_kunjungan: 25, id_obat: 1, qty: 1, tanggal_kunjungan: "2025-08-25 08:45:00" },
    { id: 26, id_kunjungan: 26, id_obat: 2, qty: 1, tanggal_kunjungan: "2025-08-26 09:40:00" },
    { id: 27, id_kunjungan: 27, id_obat: 3, qty: 1, tanggal_kunjungan: "2025-08-27 10:50:00" },
    { id: 28, id_kunjungan: 28, id_obat: 4, qty: 1, tanggal_kunjungan: "2025-08-28 08:55:00" },
    { id: 29, id_kunjungan: 29, id_obat: 5, qty: 1, tanggal_kunjungan: "2025-08-29 09:20:00" },
    { id: 30, id_kunjungan: 30, id_obat: 6, qty: 1, tanggal_kunjungan: "2025-08-30 11:00:00" },
  ]);
};
