import {PrimaryKey} from "../types";

export function primaryKey(objValue: Record<string, any> | PrimaryKey, idField: string = 'id'): PrimaryKey {
    return String(typeof objValue === 'object' ? objValue[idField] : objValue)
}