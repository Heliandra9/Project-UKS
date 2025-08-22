/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("tbl_obat", (table) => {
        table.increments("id").primary();
        table.text("nama_obat").notNullable();
        table.string("kode_obat", 100).notNullable();
        table
        .enu("jenis_obat", ["Tablet", "Sirup", "Kapsul", "Salep"])
        .notNullable();
        table.string("kandungan", 100).notNullable();
        table.integer("stock_obat").notNullable();
        table.enu("satuan", ["pcs", "ml"]).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tbl_obat');
};
