import { importExportPlugin } from '@payloadcms/plugin-import-export'
import type { CollectionSlug } from 'payload'
import { collections } from '../collections'

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
  }))
})
