"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TodoItemsController_1 = require("./TodoItemsController");
const todoItemsService_1 = require("../../services/todoItemsService");
const registerEndpoint = (router, { database, getSchema }) => {
    router.get('/list/:listId', async (req, res) => {
        const { listId } = req.params;
        const controller = new TodoItemsController_1.TodoItemsController(new todoItemsService_1.TodoItemsService(true, {
            knex: database,
            schema: await getSchema(),
            accountability: null
        }));
        const todoItemsForList = await controller.getAllItemsFromList(listId);
        res.json(todoItemsForList);
    });
};
exports.default = registerEndpoint;
