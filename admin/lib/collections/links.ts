import { Website, websites } from '@books-about-food/shared/data/websites'
import { CollectionCustomizer, TRow } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

const websiteErrorMessage =
  'Please choose either a website from the dropdown or enter a custom website'

export function customiseLinks(
  collection: CollectionCustomizer<Schema, 'links'>
) {
  collection
    .removeField('site')
    .addField('Website', {
      dependencies: ['site'],
      getValues: async (records) => {
        return records.map((record) =>
          websites.includes(record.site as Website) ? record.site : ''
        )
      },
      columnType: 'Enum',
      enumValues: [...websites, '']
    })

    .addField('WebsiteOther', {
      dependencies: ['site'],
      getValues: async (records) => {
        return records.map((record) =>
          websites.includes(record.site as Website) ? '' : record.site || ''
        )
      },
      columnType: 'String'
    })

  type LinkRow = TRow<Schema, 'links'>

  function resolveWebsite(
    { Website, WebsiteOther, ...data }: Partial<LinkRow>,
    onError: (this: void, message: string) => void
  ) {
    if (!Website && !WebsiteOther) return data

    const site = Website?.length ? Website : WebsiteOther
    if (!site?.length) return onError(websiteErrorMessage)
    return { ...data, site }
  }

  collection.overrideCreate(async function (context) {
    const data = context.data.flatMap(
      (r) => resolveWebsite(r, (m) => context.throwValidationError(m)) || []
    )
    return await context.collection.create(data)
  })

  collection.overrideUpdate(async function (context) {
    const data = resolveWebsite(context.patch, (m) =>
      context.throwValidationError(m)
    )
    if (!data) return

    await context.collection.update(context.filter, {
      ...data,
      updated_at: new Date().toISOString()
    })
  })
}
