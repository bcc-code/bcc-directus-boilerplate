import { PrimaryKey } from "@directus/shared/src/types";
import { MutationOptions } from "directus/dist/types";
import { Accountability, SchemaOverview } from "@directus/shared/types";
import { ItemsService } from "directus";
import { Knex } from 'knex';
import { TodoItem } from "../models/TodoItem";
type ServiceContext = {
    knex: Knex<any, any[]>;
    schema: SchemaOverview;
    accountability: Accountability | null;
};
export declare class TodoItemsService extends ItemsService {
    constructor(asAdmin: boolean, context: ServiceContext);
    getAllItemsFromList(listId: string): Promise<TodoItem[]>;
    updateMany(keys: PrimaryKey[], data: Partial<TodoItem>, opts?: MutationOptions): Promise<PrimaryKey[]>;
    protected cacheKey(key: PrimaryKey): string;
}
export {};
