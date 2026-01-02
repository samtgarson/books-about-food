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
      tags: {
        // Has at least one tag with at least one published book
        'tags.books.status': { equals: 'published' }
      }
    },
    depth: TAG_GROUP_DEPTH
  })

  return docs
})
