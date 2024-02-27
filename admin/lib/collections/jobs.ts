import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseJobs = (
  collection: CollectionCustomizer<Schema, 'jobs'>
) => {
  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })
}
