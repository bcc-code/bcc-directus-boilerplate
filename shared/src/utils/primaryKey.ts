import {ID} from '../types';

export function primaryKey<
  T extends Record<string | number | symbol, any>,
  K extends keyof T = 'id'
>(objValue: T | ID<T, K>, idField = 'id' as K): ID<T, K> {
  return typeof objValue === 'object' ? objValue[idField] : objValue;
}
