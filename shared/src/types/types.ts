export type {Item, PrimaryKey} from "@directus/shared/types";

export type LATITUDE = number
export type LONGITUDE = number
export type AGeoPoint = [LATITUDE, LONGITUDE]

export type LANGUAGE_CODE = string;
export type HTML = string;
export type URL = string;

export type DB_TIMESTAMP = string
export type DB_DATE = string

export const enum ITEM_STATUS {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}