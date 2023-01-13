import {Item} from '@directus/shared/types';
import {TodoList} from './TodoList';
import {ID} from '../types';

export interface TodoItem extends Item {
  id: string;
  text: string;
  is_done: boolean;
  list_id: ID<TodoList>;
  user_created?: string;
  date_created?: Date;
}
