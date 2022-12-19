import {Item} from '@directus/shared/types';

export interface TodoItem extends Item {
  id: string;
  text: string;
  is_done: boolean;
  list_id: string;
  user_created?: string;
  date_created?: Date;
}
