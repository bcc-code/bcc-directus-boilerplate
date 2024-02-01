# Action Block Directus Extension

Blocks certain actions for all users regardless of role or admin status.

Useful for:

- Preventing admins on production environment to change the schema
- Preventing collections synced with schema-sync from being updated

## Environment Variables

| Variable | Description | Default | Example |
| -------- | ----------- | ------- | ------- |
| `ACTION_BLOCK_ENABLED` | Whether to enable the extension functionality or not. | `false` | `true` or `false` |
| `ACTION_BLOCK_COLLECTIONS` | (optional) Array of collections for which all the **ACTION_BLOCK_ACTIONS** will be blocked. Required if `ACTION_BLOCK_ACTIONS` is defined. | `null` | `array:directus_collections,directus_fields,directus_relations,directus_roles,directus_permissions,directus_settings,directus_presets,directus_translations` |
| `ACTION_BLOCK_ACTIONS` | (optional) Array of actions that will be blocked for all the collections in **ACTION_BLOCK_COLLECTIONS**. Required if `ACTION_BLOCK_COLLECTIONS` is defined. | `null` | `array:create,update,delete` |
| `ACTION_BLOCK_EVENTS` | (optional) Array of events to block. Alternative, more granular way of blocking actions. Available events can be found [here](https://docs.directus.io/extensions/hooks.html#available-events).| `null` | `array:collections.update,custom_collection.items.read` |
| `ACTION_BLOCK_BYPASS_USER_IDS` | (optional) String or array of user IDs that will bypass the block rules set by this extension.| `null` | `cb7c2df3-7876-4240-944f-e0ecd766d91c` or `array:cb7c2df3-7876-4240-944f-e0ecd766d91c,d766d91c-1234-5678-944f-e0eccb7c2df3` |
