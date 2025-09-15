/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tbl_kunjungan", (table) => {
    table.increments("id").primary();
    table
      .integer("id_siswa")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tbl_siswa")
      .onDelete("CASCADE");
    table.text("keluhan");
    table.timestamp("tanggal").defaultTo(knex.fn.now());
    // 👉 kolom keterangan dihapus
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tbl_kunjungan");
};
