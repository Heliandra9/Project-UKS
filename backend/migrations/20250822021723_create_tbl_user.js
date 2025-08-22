/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("tbl_user", (table) => {
        table.increments("id_user").primary();
        table.string("username", 100).notNullable();
        table.string("password", 50).notNullable();
        table.string("tipe_user", 50).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tbl_user');
};
