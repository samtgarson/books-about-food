import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseContributions = (
  collection: CollectionCustomizer<Schema, 'contributions'>
) => {
  collection.addField('Display Name', {
    dependencies: ['book:title', 'profile:name'],
    getValues(records) {
      return records.map((r) => `${r.profile.name} on ${r.book.title}`)
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
    .replaceFieldWriting('Assistant', (value, context) => {
      context.record.tag = value ? 'Assistant' : undefined
    })
}
