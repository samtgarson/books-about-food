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
}
