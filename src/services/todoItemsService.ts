import {PrimaryKey} from "@directus/shared/src/types";
import {AbstractServiceOptions, MutationOptions} from "directus/dist/types";
import {ItemsService} from "directus";
import {TodoItem} from "@bcc-directus-boilerplate/shared/types";

export class TodoItemsService extends ItemsService {

    constructor(asAdmin: boolean, context: AbstractServiceOptions) {
        super('todo_items', {
            knex: context.knex, schema: context.schema,
            accountability: {
                ...context.accountability,
                admin: asAdmin || context.accountability?.admin
            }
        });
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