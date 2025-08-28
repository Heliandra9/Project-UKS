/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("tbl_kunjungan").del();

  await knex("tbl_kunjungan").insert([
    { id: 1, id_siswa: 1, keluhan: "Sakit kepala", tanggal: "2025-08-01 08:00:00", keterangan: "-" },
    { id: 2, id_siswa: 2, keluhan: "Demam", tanggal: "2025-08-02 09:30:00", keterangan: "-" },
    { id: 3, id_siswa: 3, keluhan: "Batuk", tanggal: "2025-08-03 10:15:00", keterangan: "-" },
    { id: 4, id_siswa: 1, keluhan: "Sakit perut", tanggal: "2025-08-04 11:00:00", keterangan: "-" },
    { id: 5, id_siswa: 2, keluhan: "Pusing", tanggal: "2025-08-05 13:20:00", keterangan: "-" },
    { id: 6, id_siswa: 3, keluhan: "Mual", tanggal: "2025-08-06 14:45:00", keterangan: "-" },
    { id: 7, id_siswa: 1, keluhan: "Sakit gigi", tanggal: "2025-08-07 08:10:00", keterangan: "-" },
    { id: 8, id_siswa: 2, keluhan: "Demam tinggi", tanggal: "2025-08-08 09:50:00", keterangan: "-" },
    { id: 9, id_siswa: 3, keluhan: "Pilek", tanggal: "2025-08-09 10:30:00", keterangan: "-" },
    { id: 10, id_siswa: 1, keluhan: "Keseleo", tanggal: "2025-08-10 08:20:00", keterangan: "-" },
    { id: 11, id_siswa: 2, keluhan: "Luka ringan", tanggal: "2025-08-11 09:25:00", keterangan: "-" },
    { id: 12, id_siswa: 3, keluhan: "Batuk", tanggal: "2025-08-12 11:40:00", keterangan: "-" },
    { id: 13, id_siswa: 1, keluhan: "Sakit perut", tanggal: "2025-08-13 08:55:00", keterangan: "-" },
    { id: 14, id_siswa: 2, keluhan: "Pusing", tanggal: "2025-08-14 10:05:00", keterangan: "-" },
    { id: 15, id_siswa: 3, keluhan: "Mual", tanggal: "2025-08-15 13:15:00", keterangan: "-" },
    { id: 16, id_siswa: 1, keluhan: "Sakit gigi", tanggal: "2025-08-16 08:35:00", keterangan: "-" },
    { id: 17, id_siswa: 2, keluhan: "Demam", tanggal: "2025-08-17 09:45:00", keterangan: "-" },
    { id: 18, id_siswa: 3, keluhan: "Pilek", tanggal: "2025-08-18 10:25:00", keterangan: "-" },
    { id: 19, id_siswa: 1, keluhan: "Keseleo", tanggal: "2025-08-19 08:15:00", keterangan: "-" },
    { id: 20, id_siswa: 2, keluhan: "Luka ringan", tanggal: "2025-08-20 09:55:00", keterangan: "-" },
    { id: 21, id_siswa: 3, keluhan: "Batuk", tanggal: "2025-08-21 10:45:00", keterangan: "-" },
    { id: 22, id_siswa: 1, keluhan: "Pusing", tanggal: "2025-08-22 08:25:00", keterangan: "-" },
    { id: 23, id_siswa: 2, keluhan: "Mual", tanggal: "2025-08-23 09:35:00", keterangan: "-" },
    { id: 24, id_siswa: 3, keluhan: "Demam", tanggal: "2025-08-24 11:10:00", keterangan: "-" },
    { id: 25, id_siswa: 1, keluhan: "Sakit kepala", tanggal: "2025-08-25 08:45:00", keterangan: "-" },
    { id: 26, id_siswa: 2, keluhan: "Batuk", tanggal: "2025-08-26 09:40:00", keterangan: "-" },
    { id: 27, id_siswa: 3, keluhan: "Pilek", tanggal: "2025-08-27 10:50:00", keterangan: "-" },
    { id: 28, id_siswa: 1, keluhan: "Mual", tanggal: "2025-08-28 08:55:00", keterangan: "-" },
    { id: 29, id_siswa: 2, keluhan: "Demam", tanggal: "2025-08-29 09:20:00", keterangan: "-" },
    { id: 30, id_siswa: 3, keluhan: "Sakit perut", tanggal: "2025-08-30 11:00:00", keterangan: "-" },
  ]);
};
