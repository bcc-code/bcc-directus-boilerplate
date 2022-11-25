"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTodoItemDto = exports.DbTodoItemFields = void 0;
exports.DbTodoItemFields = ["id", "text", "is_done", "list_id", "user_created", "date_created"];
const toTodoItemDto = (todoItem) => ({
    id: todoItem.id,
    text: todoItem.text,
    is_done: todoItem.is_done
});
exports.toTodoItemDto = toTodoItemDto;
