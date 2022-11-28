import {Item} from "@directus/shared/types";

export interface TodoList extends Item {
    id: string;
    name: string;
    user_created?: string;
    date_created?: Date;
}