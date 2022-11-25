import {Controller, Get, Path, Route} from "tsoa";
import {toTodoItemDto, TodoItemDto} from "../../dtos/TodoItemDto";
import {TodoItemsService} from "../../services/todoItemsService";

@Route("todo_items")
export class TodoItemsController extends Controller {
    private _todoItemsService: TodoItemsService;

    constructor(todoItemsService: TodoItemsService) {
        super();
        this._todoItemsService = todoItemsService;
    }

    /**
     * @example listId "52907745-7672-470e-a803-a2f8feb52944"
     * @example listId "e77ef155-bd12-46f0-8559-bf55f6dd4c63"
     */
    @Get("/list/{listId}")
    public async getAllItemsFromList(@Path() listId: string): Promise<TodoItemDto[]> {
        const todoItems = await this._todoItemsService.getAllItemsFromList(listId);

        return todoItems.map(toTodoItemDto);
    }
}