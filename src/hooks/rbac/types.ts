import { Permission, Role } from '@directus/shared/types';

export type StoredPermission = Pick<Permission, 'action'> & Partial<Pick<Permission, 'permissions' | 'validation'>> & {
	roles?: Array<string|null>;
	presets?: Record<string, any> | null;
	fields?: Array<string> | string | null;
};
export type StoredRole = Partial<Role> & Pick<Role, 'id' | 'name' | 'icon'>;