import { CollectionCustomizer } from '@forestadmin/agent'
import { revalidatePath } from 'lib/services/revalidate-path'
import { Schema } from '../../.schema/types'

export const customiseFeatures = (
  collection: CollectionCustomizer<Schema, 'features'>
) => {
  collection.addHook('After', 'Create', async () => {
    await revalidatePath('')
  })

  collection.addHook('After', 'Delete', async () => {
    await revalidatePath('')
  })
}
