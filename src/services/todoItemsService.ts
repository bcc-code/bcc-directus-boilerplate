import { AbstractServiceOptions } from '@directus/api/types/index';
import { BaseService } from './baseService.js';

export class TodoItemsService extends BaseService {
  constructor(asAdmin: boolean, context: AbstractServiceOptions) {
    super('todo_items', asAdmin, context);
  }
}
