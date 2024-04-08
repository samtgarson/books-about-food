import { CollectionCustomizer } from '@forestadmin/agent'
import { revalidatePath } from 'lib/services/revalidate-path'
import { Schema } from '../../.schema/types'

export const customiseFAQs = (
  collection: CollectionCustomizer<Schema, 'frequently_asked_questions'>
) => {
  collection.addHook('After', 'Create', async () => {
    await revalidatePath('frequently-asked-questions')
  })

  collection.addHook('After', 'Update', async () => {
    await revalidatePath('frequently-asked-questions')
  })

  collection.addHook('After', 'Delete', async () => {
    await revalidatePath('frequently-asked-questions')
  })
}
