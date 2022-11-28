import {Controller, Get, Inject, Path, Route} from "tsoa";
import {Query as BaseQuery} from "../../types"
import {toTodoItemDto, TodoItemDto, DbTodoItemFields} from "../../dtos/TodoItemDto";
import {TodoItemsService} from "../../services/todoItemsService";
import {TodoItem} from "../../models/TodoItem";

@Route("todo_items")
export class TodoItemsController extends Controller {
    private todoItemsService: TodoItemsService;

    constructor(todoItemsService: TodoItemsService) {
        super();
        this.todoItemsService = todoItemsService;
    }

    /**
     * @example listId "52907745-7672-470e-a803-a2f8feb52944"
     */
    @Get("/list/{listId}")
    public async getTodoItemsForList(@Path() listId: string, @Inject() query: BaseQuery): Promise<TodoItemDto[]> {
        const todoItems: TodoItem[] = await this.todoItemsService.readByQuery(
            Object.assign({}, query, {
                filter: Object.assign({}, query.filter, {
                    list_id: {
                        _eq: listId
                    }
                }),
                fields: [...query.fields, ...DbTodoItemFields],
            })
        ) as TodoItem[];

        return todoItems.map(toTodoItemDto);
    }
}