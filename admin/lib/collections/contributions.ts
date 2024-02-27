import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseContributions = (
  collection: CollectionCustomizer<Schema, 'contributions'>
) => {
  collection.addField('DisplayName', {
    dependencies: ['book:title', 'profile:name', 'job:name'],
    getValues(records) {
      return records.map(
        (r) => `${r.profile.name} [${r.job.name} on ${r.book.title}]`
      )
    },
    columnType: 'String'
  })

  collection.removeField('tag')

  collection
    .addField('Assistant', {
      columnType: 'Boolean',
      getValues(records) {
        return records.map((r) => r.tag === 'Assistant')
      },
      dependencies: ['tag']
    })
    .replaceFieldWriting('Assistant', (value) => {
      return { tag: value ? 'Assistant' : undefined }
    })

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })
}
