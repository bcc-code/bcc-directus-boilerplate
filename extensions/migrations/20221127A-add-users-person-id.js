"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_users', (table) => {
        table.string('person_id', 36).nullable().comment('BCC Person ID');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_users', (table) => {
        table.dropColumn('person_id');
    });
}
exports.down = down;
