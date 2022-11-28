import { Permission, Role } from '@directus/shared/types';
import { PermissionsService } from 'directus/dist/services';
import { dump as toYaml, load as fromYaml } from 'js-yaml';
import fse from 'fs-extra';
import path from 'path';
import { isEmpty, isEqual } from 'lodash';
import { StoredPermission, StoredRole } from './types';

const configPath = process.env.RBAC_CONFIG_PATH || './config';
const permissionsPath = path.resolve(configPath, 'permissions');
const rolesFile = path.join(path.resolve(configPath), `roles.yaml`)

//
// PERMISSIONS
//

export async function getPermissionCollection(permissionId: string|number, permissionsService: PermissionsService) {
    const permission = await permissionsService.readOne(permissionId, {
        fields: ['collection'],
    }) as Permission;

    return permission.collection
}

export async function listConfiguredCollections() {
    const allFiles = await fse.readdir(permissionsPath);
    const collections: string[] = [];
    allFiles.forEach(file => {
        if (file.endsWith('.yaml')) {
            collections.push(file.replace('.yaml', ''));
        }
    });

    return collections
}

export async function importPermissions(collection: string, permissionsService: PermissionsService) {
    const yamlFile = path.join(permissionsPath, `${collection}.yaml`)
    if (! await fse.pathExists(yamlFile)) {
        return
    }

    const yamlInput = await fse.readFile(yamlFile, 'utf8')
    const permissions = fromYaml(yamlInput) as Array<StoredPermission>

    const permissionsToImport: Array<Permission> = []
    const updatingActions = new Set()
    const updatingRoles = new Set()
    permissions.forEach((block) => {
        const { action, roles, permissions, validation, presets, fields } = block
        if (isEmpty(roles)) {
            throw new Error(`Permission block ${collection}/${action} is missing roles`)
        }

        updatingActions.add(action)

        roles!.forEach((role) => {
            updatingRoles.add(role)
            permissionsToImport.push({
                role,
                action,
                collection,
                permissions: permissions || null,
                validation: validation || null,
                presets: presets || null,
                fields: typeof fields === "string" ? [fields] : fields ?? null,
            })
        })
    })

    // Delete permissions not existing more on roles that we manage
    await permissionsService.deleteByQuery({
        filter: {
            collection: { _eq: collection },
            role: {
                _in: [...updatingRoles].map((role) => role === null ? permissionsService.knex.raw('NULL') : role) as Array<string>,
            },
            action: {
                _nin: [...updatingActions] as Array<string>,
            },
        }
    }, { emitEvents: false })

    const queue = permissionsToImport.map(async (permission) => {
        const { collection, action, role } = permission
        const exists = await permissionsService.readByQuery({
            filter: {
                collection: { _eq: collection },
                action: { _eq: action },
                role: role === null ? { _null: true } : { _eq: role },
            },
            limit: 1,
            fields: ['id']
        }, { emitEvents: false })

        if (exists?.length) {
            await permissionsService.updateOne(exists[0].id, permission, { emitEvents: false })
        } else {
            await permissionsService.createOne(permission, { emitEvents: false })
        }
    })

    await Promise.all(queue)
}

export async function exportPermissions(collection: string, permissionsService: PermissionsService) {
    const rows = await permissionsService.readByQuery({
        filter: {
            collection: { _eq: collection },
        },
    }) as Permission[]

    // Find matching permissions to group roles into
    const uniquePerms: Array<[StoredPermission, Array<string | null>]> = []
    rows.forEach(row => {
        const { role, action, permissions, validation, presets, fields } = row;
        const perm: StoredPermission = {
            action
        }
        if (! isEmpty(permissions)) {
            perm.permissions = permissions;
        }
        if (! isEmpty(validation)) {
            perm.validation = validation;
        }
        if (! isEmpty(presets)) {
            perm.presets = presets;
        }

        if (Array.isArray(fields) && fields.length) {
            fields.sort((a, b) => a.localeCompare(b))
            perm.fields = fields.length === 1 ? fields[0] : fields
        }

        const found = uniquePerms.find((unique) => isEqual(unique[0], perm))
        if (found) {
			if (! found[1].includes(role)) {
				found[1].push(role);
			}
        } else {
            uniquePerms.push([perm, [role]]);
        }
    })

    // Add the roles to each unique permission
    const permissions: Array<StoredPermission> = uniquePerms.map(([perm, roles]) => {
        perm.roles = roles;
        return perm;
    })

    let yamlOutput = toYaml(permissions, {
        sortKeys: true,
    })

    const yamlFile = path.join(permissionsPath, `${collection}.yaml`)
    if (! yamlOutput.startsWith('[]')) {
        yamlOutput = yamlOutput.replaceAll('- action', '\n- action')
        await fse.writeFile(yamlFile, yamlOutput, 'utf8');
    } else {
        await fse.remove(yamlFile)
    }
}

//
// ROLES
//

export async function importRoles(rolesService: PermissionsService) {
    console.log('Importing Roles')
    if (! await fse.pathExists(rolesFile)) {
        return void 0;
    }

    const yamlInput = await fse.readFile(rolesFile, 'utf8')
    const roles = fromYaml(yamlInput) as Array<StoredRole>

    const rolesToImport: Array<Role> = roles.map((block) => {
        const { id, name, icon, description, enforce_tfa, external_id, ip_whitelist, app_access, admin_access } = block

        return {
            id,
            name,
            icon: icon ?? 'supervised_user_circle',
            description: description ?? '',
            enforce_tfa: enforce_tfa ?? false,
            external_id: external_id ?? null,
            ip_whitelist: ip_whitelist ?? [],
            app_access: app_access ?? false,
            admin_access: admin_access ?? false,
        }
    })

    return await rolesService.upsertMany(rolesToImport, { emitEvents: false })
}

export async function exportRoles(rolesService: PermissionsService) {
    console.log('Exporting Roles')
    const rows = await rolesService.readByQuery({
        limit: -1,
        fields: ['id', 'name', 'icon', 'description', 'enforce_tfa', 'external_id', 'ip_whitelist', 'app_access', 'admin_access'],
    }) as Role[]

    const roles: Array<StoredRole> = rows.map((row) => {
        const { id, name, icon, ...optional } = row
        const role: StoredRole = {
            id,
            name,
            icon,
        }

        // We only want to dump the optional fields if they are not falsy
        Object.entries(optional).forEach(([key, value]) => {
            if (!! value) {
				// @ts-ignore
				role[key] = value
            }
        })

        return role
    })

    let yamlOutput = toYaml(roles, {
        sortKeys: false,
    })

    if (! yamlOutput.startsWith('[]')) {
        yamlOutput = yamlOutput.replaceAll('- id', '\n- id')

        await fse.writeFile(rolesFile, yamlOutput, 'utf8')
    } else {
        await fse.remove(rolesFile)
    }
}
