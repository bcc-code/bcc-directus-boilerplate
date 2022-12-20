import {EndpointConfig} from '@directus/shared/types';
import {AbstractServiceOptions} from 'directus/dist/types';
import {TodoItemsController} from './TodoItemsController';
import {TodoItemsService} from '../../services/todoItemsService';

const registerEndpoint: EndpointConfig = (router, {database, getSchema}) => {
  router.get('/list/:listId', async (req, res) => {
    const {listId} = req.params;
    const controller = await createTodoItemsController(
      req.accountability,
      true
    );

    const todoItemsForList = await controller.getTodoItemsForList(
      listId,
      req.sanitizedQuery
    );
    res.json(todoItemsForList);
  });

  const createTodoItemsController = async (
    accountability: AbstractServiceOptions['accountability'],
    asAdmin = false
  ): Promise<TodoItemsController> => {
    return new TodoItemsController(
      new TodoItemsService(asAdmin, {
        knex: database,
        schema: await getSchema(),
        accountability,
      })
    );
  };
};

export default registerEndpoint;
