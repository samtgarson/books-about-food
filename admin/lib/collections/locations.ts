import { slugify } from '@books-about-food/shared/utils/slugify'
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
    context.data.forEach(function (r, i) {
      if (!r.display_text) return
      context.data[i].slug = slugify(r.display_text)
    })

    context.throwForbiddenError(
      'Use the place search action to create locations.'
    )
  })

  collection.addHook('Before', 'Update', async (context) => {
    if (context.patch.display_text) {
      context.patch.slug = slugify(context.patch.display_text)
    }
    context.patch.updated_at = new Date().toISOString()
  })
}
