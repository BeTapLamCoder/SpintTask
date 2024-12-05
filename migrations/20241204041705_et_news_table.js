/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const exists = await knex.schema.hasTable('et_news');
    if (!exists) {
        return knex.schema.createTable('et_news', (table) => {
            table.increments('id').primary();
            table.string('title', 100).notNullable();
            table.text('content').notNullable();
            table.string('author', 255).notNullable();
            table.datetime('publishDate').notNullable();
            table.datetime('created_at').defaultTo(knex.fn.now()).notNullable();
            table.datetime('updated_at').defaultTo(knex.fn.now()).notNullable();
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('et_news');
};

