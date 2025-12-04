import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export function customiseLocations(
  collection: CollectionCustomizer<Schema, 'locations'>
) {
  /* =============================================
   * FIELDS
   * ============================================= */
  /* =============================================
   * FORM CUSTOMIZATION
   * ============================================= */
  /* =============================================
   * HOOKS
   * ============================================= */
  collection.addHook('Before', 'Create', async (context) => {
    context.throwForbiddenError(
      'Use the place search action to create locations.'
    )
  })

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })
}
