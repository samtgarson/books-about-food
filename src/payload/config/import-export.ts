import { importExportPlugin } from '@payloadcms/plugin-import-export'
import type { Access, CollectionConfig, CollectionSlug } from 'payload'
import { collections } from '../collections'

function isAdmin({ req }: Parameters<Access>[0]) {
  return req.user?.role === 'admin'
}

// The plugin's own `exports`/`imports` collections are hidden from the nav,
// but are still reachable via the API, so lock them down to admins.
function restrictToAdmins({
  collection
}: {
  collection: CollectionConfig
}): CollectionConfig {
  return {
    ...collection,
    access: {
      ...collection.access,
      read: isAdmin,
      create: isAdmin,
      delete: isAdmin
    }
  }
}

/**
 * Adds an "Export" option to every collection's list view in the admin. CSVs
 * are generated on demand and downloaded straight to the browser rather than
 * saved, as the server's local filesystem is ephemeral.
 */
export const importExport = importExportPlugin({
  collections: collections.map(({ slug }) => ({
    slug: slug as CollectionSlug,
    import: false,
    export: {
      format: 'csv',
      disableSave: true,
      disableJobsQueue: true
    }
  })),
  overrideExportCollection: restrictToAdmins,
  overrideImportCollection: restrictToAdmins
})
