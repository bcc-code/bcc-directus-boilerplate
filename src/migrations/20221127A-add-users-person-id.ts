import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('directus_users', table => {
    table.string('person_id', 36).nullable().comment('BCC Person ID');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('directus_users', table => {
    table.dropColumn('person_id');
  });
}
