export type {PrimaryKey} from '@directus/shared/types';

export type ID<
  T extends Record<string | number | symbol, any>,
  K extends keyof T = 'id'
> = T[K];

export interface Item {
  id: string | number;
}

export type PartialItem<T extends Item> = Partial<T> & Pick<T, 'id'>;

export type LATITUDE = number;
export type LONGITUDE = number;
export type AGeoPoint = [LATITUDE, LONGITUDE];

export type LANGUAGE_CODE = string;
export type HTML = string;
export type URL = string;

export type DB_TIMESTAMP = string;
export type DB_DATE = string;

export const enum ITEM_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
