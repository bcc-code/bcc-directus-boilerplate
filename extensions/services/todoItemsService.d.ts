import { PrimaryKey } from "@directus/shared/src/types";
import { AbstractServiceOptions, MutationOptions } from "directus/dist/types";
import { ItemsService } from "directus";
import { TodoItem } from "../models/TodoItem";
export declare class TodoItemsService extends ItemsService {
    constructor(asAdmin: boolean, context: AbstractServiceOptions);
    updateMany(keys: PrimaryKey[], data: Partial<TodoItem>, opts?: MutationOptions): Promise<PrimaryKey[]>;
    protected cacheKey(key: PrimaryKey): string;
}
