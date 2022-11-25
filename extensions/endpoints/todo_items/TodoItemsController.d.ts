import { Query as BaseQuery } from "../../types";
import { Controller } from "tsoa";
import { TodoItemDto } from "../../dtos/TodoItemDto";
import { TodoItemsService } from "../../services/todoItemsService";
export declare class TodoItemsController extends Controller {
    private todoItemsService;
    constructor(todoItemsService: TodoItemsService);
    /**
     * @example listId "52907745-7672-470e-a803-a2f8feb52944"
     * @example listId "e77ef155-bd12-46f0-8559-bf55f6dd4c63"
     */
    getTodoItemsForList(listId: string, query: BaseQuery): Promise<TodoItemDto[]>;
}
