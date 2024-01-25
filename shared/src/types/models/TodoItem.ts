import { Item } from '@directus/types';
import { TodoList } from './TodoList.js';
import { ID } from '../types.js';

export interface TodoItem extends Item {
  id: string;
  text: string;
  is_done: boolean;
  list_id: ID<TodoList>;
  user_created?: string;
  date_created?: Date;
}
