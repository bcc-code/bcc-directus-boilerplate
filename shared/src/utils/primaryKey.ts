import {PrimaryKey} from '../types';

export function primaryKey(
  objValue: Record<string, any> | PrimaryKey,
  idField = 'id'
): PrimaryKey {
  return String(typeof objValue === 'object' ? objValue[idField] : objValue);
}
