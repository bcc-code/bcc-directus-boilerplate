"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const registerHook = (({ action, filter, init }, extCtx) => {
    const { services: { CollectionsService, PermissionsService, RolesService }, env, logger } = extCtx;
    const onCreate = async ({ key }, { database, schema }) => {
        const permissionsService = new PermissionsService({ database, schema });
        const permission = await permissionsService.readOne(key, {
            fields: ['id', 'collection'],
        });
        await (0, helpers_1.exportPermissions)(permission.collection, permissionsService);
    };
    const onUpdate = async ({ keys }, { database, schema }) => {
        const permissionsService = new PermissionsService({ database, schema });
        const permissions = await permissionsService.readMany(keys, {
            fields: ['id', 'collection'],
        });
        const uniqueCollections = [...new Set(permissions.map(p => p.collection))];
        await Promise.all(uniqueCollections.map((collection) => (0, helpers_1.exportPermissions)(collection, permissionsService)));
    };
    //
    // Need to keep track of what collection the deleting permission is for
    // so that we can dump the permissions after it is deleted
    //
    const deletingPermissions = {};
    const beforeDelete = async (keys, _meta, { database, schema }) => {
        const permissionsService = new PermissionsService({ database, schema });
        const permissions = await permissionsService.readMany(keys, {
            fields: ['id', 'collection'],
        });
        permissions.forEach(({ id, collection }) => {
            deletingPermissions[id] = collection;
        });
    };
    const onDelete = async ({ keys }, { database, schema }) => {
        const permissionsService = new PermissionsService({ database, schema });
        const uniqueCollections = new Set();
        keys.forEach((key) => uniqueCollections.add(deletingPermissions[key]));
        await Promise.all([...uniqueCollections].map((collection) => (0, helpers_1.exportPermissions)(collection, permissionsService)));
        keys.forEach((key) => delete deletingPermissions[key]);
    };
    const onRoleChanges = (_payload, { database, schema }) => {
        const rolesService = new RolesService({ database, schema });
        return (0, helpers_1.exportRoles)(rolesService);
    };
    async function syncToDb() {
        const { getSchema, database } = extCtx;
        const schema = await getSchema();
        const permissionsService = new PermissionsService({ database, schema });
        const rolesService = new RolesService({ database, schema });
        // Sync roles into db
        console.log('Importing roles...');
        await (0, helpers_1.importRoles)(rolesService);
        // Sync permissions into db
        console.log('Importing permissions...');
        const collections = await (0, helpers_1.listConfiguredCollections)();
        await Promise.all(collections.map(collection => (0, helpers_1.importPermissions)(collection, permissionsService)));
        console.log('RBAC imported!');
    }
    if (['EXPORT', 'FULL'].includes(env.RBAC_SYNC_MODE)) {
        action('roles.create', onRoleChanges);
        action('roles.update', onRoleChanges);
        action('roles.delete', onRoleChanges);
        action('permissions.create', onCreate);
        action('permissions.update', onUpdate);
        filter('permissions.delete', beforeDelete);
        action('permissions.delete', onDelete);
    }
    if (['IMPORT', 'FULL'].includes(env.RBAC_SYNC_MODE)) {
        setTimeout(syncToDb, 10);
    }
    init('cli.before', async ({ program }) => {
        const dbCommand = program.command('rbac');
        // Only allow this command when not automatically importing        
        dbCommand.command('import')
            .description('Sync configured roles and permissions from files to database')
            .action(async () => {
            if (!['IMPORT', 'FULL'].includes(env.RBAC_SYNC_MODE)) {
                try {
                    await syncToDb();
                    process.exit(0);
                }
                catch (err) {
                    logger.error(err);
                }
            }
            else {
                logger.warn('RBAC Sync is configured to automatically import roles and permissions. Skipping manual import.');
            }
            process.exit(1);
        });
        dbCommand.command('export')
            .description('Sync roles and permissions from DB to file')
            .option('--system', 'Include system collections')
            .action(async ({ system = false }) => {
            const { getSchema, database } = extCtx;
            console.log('Exporting RBAC...');
            try {
                const schema = await getSchema();
                const collectionsService = new CollectionsService({ database, schema });
                const permissionsService = new PermissionsService({ database, schema });
                const rolesService = new RolesService({ database, schema });
                const collections = await collectionsService.readByQuery();
                console.log('Exporting permissions...');
                await Promise.all(collections.map(({ collection }) => {
                    if (!system && collection.startsWith('directus_')) {
                        return void 0;
                    }
                    return (0, helpers_1.exportPermissions)(collection, permissionsService);
                }));
                console.log('Exporting roles...');
                await (0, helpers_1.exportRoles)(rolesService);
                console.log('RBAC exported!');
                process.exit(0);
            }
            catch (err) {
                logger.error(err);
                process.exit(1);
            }
        });
    });
});
exports.default = registerHook;
