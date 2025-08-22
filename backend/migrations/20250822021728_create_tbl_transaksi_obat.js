/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("tbl_transaksi_obat", (table) => {
        table.increments("id").primary();
        table
        .integer("id_kunjungan")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("tbl_kunjungan")
        .onDelete("CASCADE");
        table
        .integer("id_obat")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("tbl_obat")
        .onDelete("CASCADE");
        table.integer("qty").notNullable();
        table.timestamp("tanggal_kunjungan").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tbl_transaksi_obat');
};
