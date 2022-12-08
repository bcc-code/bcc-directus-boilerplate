import { AbstractServiceOptions } from "directus/dist/types";
import { BaseService } from "./baseService";

export class TodoItemsService extends BaseService {
    constructor(asAdmin: boolean, context: AbstractServiceOptions) {
        super('todo_items', asAdmin, context);
    }
}