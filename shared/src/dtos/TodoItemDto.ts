import {TodoItem} from "../types";

export const DbTodoItemFields = ["id", "text", "is_done", "list_id", "user_created", "date_created"]

export type TodoItemDto = {
    id: string;
    text: string;
    is_done: boolean;
}

export const toTodoItemDto = (todoItem: TodoItem): TodoItemDto => ({
    id: todoItem.id,
    text: todoItem.text,
    is_done: todoItem.is_done
});