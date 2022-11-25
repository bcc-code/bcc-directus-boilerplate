import { faker } from "@faker-js/faker";
import type { Knex } from "knex";

export const seed = async (knex: Knex) => {
    /** Cleanup */
    await knex('todo_items').del();
    await knex('todo_lists').del();

    const lists = [{
        id: faker.datatype.uuid(),
        name: 'My first list',
    }]

    const items = Array.from({ length: 10 }).map(() => ({
        text: faker.lorem.sentence(),
        is_done: faker.datatype.boolean(),
        list_id: lists[0].id,
    }));

    await knex('todo_lists').insert(lists);
    await knex('todo_items').insert(items);
}