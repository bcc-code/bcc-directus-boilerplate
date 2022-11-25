import {EndpointConfig} from "@directus/shared/src/types";
import {TodoItemsController} from "./TodoItemsController";
import {TodoItemsService} from "../../services/todoItemsService";

const registerEndpoint: EndpointConfig = (router, {database, getSchema}) => {
    router.get('/list/:listId', async (req, res) => {
        const {listId} = req.params;

        const controller = new TodoItemsController(
            new TodoItemsService(
                true,
                {
                    knex: database,
                    schema: await getSchema(),
                    accountability: null
                }));

        const todoItemsForList = await controller.getAllItemsFromList(listId);
        res.json(todoItemsForList)
    })
}

export default registerEndpoint;