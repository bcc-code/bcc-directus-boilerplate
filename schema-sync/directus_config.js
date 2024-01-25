/**
 * This file contains the default configuration for the schema exporter.
 * 
 * Some possibly sensitive collections are commented out, remove the comments and add filters if needed
 * 
 * Uncomment the collection you want to export.
 * 
 * These are just some sensible settings, but you might not want to export everything
 * 
 * Add custom collections to the syncCustomCollections object in the config.js file.
 */
export const syncDirectusCollections = {
	directus_roles: {
		watch: ['roles'],
	},
	directus_folders: {
		watch: ['folders'],
		excludeFields: [],
		query: {
			sort: ['parent', 'id'],
		},
	},
	directus_permissions: {
		watch: ['permissions', 'collections', 'fields'],
		excludeFields: ['id'],
		getKey: (o) => `${o.role ?? 'public'}-${o.collection}--${o.action}`,
		query: {
			sort: ['role', 'collection', 'action'],
		},
	},
	directus_settings: {
		watch: ['settings'],
		excludeFields: [
			'project_url', 'project_logo', 'public_background', 'public_foreground',
			// always keep these 3 excluded
			'mv_hash', 'mv_ts', 'mv_locked',
		],
	},
	directus_dashboards: {
		watch: ['dashboards'],
		excludeFields: ['user_created', 'panels'],
	},
	directus_panels: {
		watch: ['panels'],
		excludeFields: ['user_created'],
	},
	directus_presets: {
		watch: ['presets'],
		excludeFields: ['id'],
		getKey: (o) => `${o.role ?? 'all'}-${o.collection}-${o.bookmark || 'default'}`,
		query: {
			filter: {
				user: { _null: true}
			}
		}
	},
	/*directus_flows: {
		watch: ['flows'],
		excludeFields: ['operations', 'user_created'],
		query: {
			filter: {
				trigger: { _neq: 'webhook' },
			},
		},
	},
	directus_operations: {
		watch: ['operations'],
		excludeFields: ['user_created'],
		query: {
			filter: {
				flow: { trigger: { _neq: 'webhook' } },
			},
		},
	},*/
	directus_translations: {
		watch: ['translations'],
		excludeFields: ['id'],
		getKey: (o) => `${o.key}-${o.language}`,
		query: {
			sort: ['key', 'language'],
		},
	},
	/* directus_webhooks: {
		watch: ['webhooks'],
		excludeFields: ['url'],
	}, */
};