import { Controller } from "tsoa";
import { Query as BaseQuery } from "../../types";
import { TodoItemDto } from "../../dtos/TodoItemDto";
import { TodoItemsService } from "../../services/todoItemsService";
export declare class TodoItemsController extends Controller {
    private todoItemsService;
    constructor(todoItemsService: TodoItemsService);
    /**
     * @example listId "52907745-7672-470e-a803-a2f8feb52944"
     */
    getTodoItemsForList(listId: string, query: BaseQuery): Promise<TodoItemDto[]>;
}
