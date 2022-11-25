import {PrimaryKey} from "@directus/shared/src/types";
import {MutationOptions} from "directus/dist/types";
import {Accountability, SchemaOverview} from "@directus/shared/types";
import {ItemsService} from "directus";
import {Knex} from 'knex';
import {TodoItem} from "../models/TodoItem";
import {DbTodoItemFields} from "../dtos/TodoItemDto";

type ServiceContext = {
    knex: Knex<any, any[]>,
    schema: SchemaOverview,
    accountability: Accountability | null,
}

export class TodoItemsService extends ItemsService {

    constructor(asAdmin: boolean, context: ServiceContext) {
        super('todo_items', {
            knex: context.knex, schema: context.schema,
            accountability: {
                ...context.accountability,
                admin: asAdmin || context.accountability?.admin
            }
        });
    }

    async getAllItemsFromList(listId: string): Promise<TodoItem[]> {
        const todoItems: TodoItem[] = await super.readByQuery({
            filter: {
                list_id: {
                    _eq: listId
                }
            },
            fields: DbTodoItemFields
        }) as TodoItem[];

        return todoItems;
    }

    async updateMany(keys: PrimaryKey[], data: Partial<TodoItem>, opts?: MutationOptions): Promise<PrimaryKey[]> {
        const updatedKeys: PrimaryKey[] = await super.updateMany(keys, data, opts);
        await this.cache?.delete(updatedKeys.map(key => this.cacheKey(key)))

        return updatedKeys;
    }

    protected cacheKey(key: PrimaryKey) {
        return `todo-items_${key}`
    }
}