"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoItemsService = void 0;
const directus_1 = require("directus");
class TodoItemsService extends directus_1.ItemsService {
    constructor(asAdmin, context) {
        var _a;
        super('todo_items', {
            knex: context.knex, schema: context.schema,
            accountability: {
                ...context.accountability,
                admin: asAdmin || ((_a = context.accountability) === null || _a === void 0 ? void 0 : _a.admin)
            }
        });
    }
    async updateMany(keys, data, opts) {
        var _a;
        const updatedKeys = await super.updateMany(keys, data, opts);
        await ((_a = this.cache) === null || _a === void 0 ? void 0 : _a.delete(updatedKeys.map(key => this.cacheKey(key))));
        return updatedKeys;
    }
    cacheKey(key) {
        return `todo-items_${key}`;
    }
}
exports.TodoItemsService = TodoItemsService;
