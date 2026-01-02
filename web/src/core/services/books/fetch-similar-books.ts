import { Service } from 'src/core/services/base'
import { z } from 'zod'
import { bookJoin, bookSelect, queryBooks } from './sql-helpers'

export const fetchSimilarBooks = new Service(
  z.object({ slug: z.string() }),
  async ({ slug }, _ctx) => {
    return queryBooks`
      select
        ${bookSelect},
        count(distinct match.id) as match_count
      from books
      ${bookJoin}
      inner join _books_tags on _books_tags."A" = books.id
      inner join tags on _books_tags."B" = tags.id
      join (
        select distinct tags.id from tags
        inner join _books_tags on _books_tags."B" = tags.id
        inner join books on _books_tags."A" = books.id
        where books.slug = ${slug}
      ) as match on match.id = tags.id
      where books.slug <> ${slug}
      group by books.id, cover_image.id
      order by match_count desc
      limit 10
    `
  }
)
