"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TodoItemsController_1 = require("./TodoItemsController");
const todoItemsService_1 = require("../../services/todoItemsService");
const registerEndpoint = (router, { database, getSchema }) => {
    router.get('/list/:listId', async (req, res) => {
        const { listId } = req.params;
        const controller = await createTodoItemsController(req.accountability, true);
        const todoItemsForList = await controller.getTodoItemsForList(listId, req.sanitizedQuery);
        res.json(todoItemsForList);
    });
    const createTodoItemsController = async (accountability, asAdmin = false) => {
        return new TodoItemsController_1.TodoItemsController(new todoItemsService_1.TodoItemsService(asAdmin, {
            knex: database,
            schema: await getSchema(),
            accountability
        }));
    };
};
exports.default = registerEndpoint;
