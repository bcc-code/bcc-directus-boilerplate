import { faker } from "@faker-js/faker";
import type { Knex } from "knex";
import type { TodoItem, TodoList } from "@bcc-directus-boilerplate/shared/types";

export const seed = async (knex: Knex) => {
    /** Cleanup */
    await knex('todo_items').del();
    await knex('todo_lists').del();

    const lists: Pick<TodoList, 'id'|'name'>[] = [{
        id: faker.datatype.uuid(),
        name: 'My first list'
    }]

    const items: Pick<TodoItem, 'text'|'is_done'|'list_id'>[] = Array.from({ length: 10 }).map(() => ({
        text: faker.lorem.sentence(),
        is_done: faker.datatype.boolean(),
        list_id: lists[0].id,
    }));

    await knex('todo_lists').insert(lists);
    await knex('todo_items').insert(items);
}