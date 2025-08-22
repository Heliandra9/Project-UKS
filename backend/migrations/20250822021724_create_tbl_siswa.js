/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("tbl_siswa", (table) => {
        table.increments("id").primary();
        table.string("nama", 150).notNullable();
        table.string("kelas", 50).notNullable();
        table.integer("nis").notNullable();
        table.integer("tinggi_badan").notNullable();
        table.integer("berat_badan").notNullable();
        table
        .enu("golongan_darah", ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"])
        .notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tbl_siswa');
};
