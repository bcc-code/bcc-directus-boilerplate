"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoItemsController = void 0;
const tsoa_1 = require("tsoa");
const TodoItemDto_1 = require("../../dtos/TodoItemDto");
let TodoItemsController = class TodoItemsController extends tsoa_1.Controller {
    constructor(todoItemsService) {
        super();
        this._todoItemsService = todoItemsService;
    }
    /**
     * @example listId "52907745-7672-470e-a803-a2f8feb52944"
     * @example listId "e77ef155-bd12-46f0-8559-bf55f6dd4c63"
     */
    async getAllItemsFromList(listId) {
        const todoItems = await this._todoItemsService.getAllItemsFromList(listId);
        return todoItems.map(TodoItemDto_1.toTodoItemDto);
    }
};
__decorate([
    (0, tsoa_1.Get)("/list/{listId}"),
    __param(0, (0, tsoa_1.Path)())
], TodoItemsController.prototype, "getAllItemsFromList", null);
TodoItemsController = __decorate([
    (0, tsoa_1.Route)("todo_items")
], TodoItemsController);
exports.TodoItemsController = TodoItemsController;
