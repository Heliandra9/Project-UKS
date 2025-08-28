/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tbl_user').del()
  // Seed user
  await knex("tbl_user").insert([
    { id_user: 1, 
      username: "admin", 
      password: "admin", 
      tipe_user: "admin" 
    },
    {
      id_user: 2,
      username: "amin",
      password: "operator",
      tipe_user: "operator",
    },
  ]);
};
