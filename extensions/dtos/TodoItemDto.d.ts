import { TodoItem } from "../models/TodoItem";
export declare const DbTodoItemFields: string[];
export type TodoItemDto = {
    id: string;
    text: string;
    is_done: boolean;
};
export declare const toTodoItemDto: (todoItem: TodoItem) => TodoItemDto;
