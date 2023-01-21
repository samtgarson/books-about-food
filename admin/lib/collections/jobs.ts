import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseJobs = (
  collection: CollectionCustomizer<Schema, 'jobs'>
) => {
  collection.addManyToManyRelation('profiles', 'jobs', '_profiles_jobs', {
    originKey: 'A',
    foreignKey: 'B',
    originKeyTarget: 'id',
    foreignKeyTarget: 'id'
  })
}
