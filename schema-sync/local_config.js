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
export const syncCustomCollections = {
	// Directus tables
  directus_users: {
    watch: ['users'],
    excludeFields: ['person', 'roles', 'organizations', 'events', 'activities', 'last_page', 'last_access'],
    prefix: 'local_',
    onExport: async (item, itemsSrv) => { // Export only default admin user
      if (item.email === 'admin@example.com') {
        item.password = '12345678';
        return item;
      }
    },
    onImport: async (item, itemsSrv) => { // Import only default admin user
      if (item.email === 'admin@example.com') {
        item.password = '12345678';
        return item;
      }
    },
  },
  // Other tables
  todo_lists: {
    watch: ['todo_lists.items'],
    prefix: 'testdata_',
  },
  todo_items: {
    watch: ['todo_items.items'],
    prefix: 'testdata_',
  },
};