import { requirePopulatedArray } from 'src/core/models/utils/payload-validation'
import { Service } from 'src/core/services/base'
import { TAG_GROUP_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'

export const fetchTagGroups = new Service(z.undefined(), async function (
  _input,
  { payload }
) {
  const { docs } = await payload.find({
    collection: 'tag-groups',
    sort: 'name',
    where: {
      adminOnly: { equals: false },
      'tags.books.status': { equals: 'published' }
    },
    depth: TAG_GROUP_DEPTH
  })

  return docs.map(({ tags, ...group }) => ({
    ...group,
    tags: requirePopulatedArray(tags?.docs || [], 'TagGroup.tags')
  }))
})
