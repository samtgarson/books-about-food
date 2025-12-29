import { fetchCollections } from '@books-about-food/core/services/collections/fetch-collections'
import { notFound } from 'next/navigation'
import { OGTemplate } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

export const revalidate = 3600 // 1 hour

export async function GET() {
  const { data: { total } = {} } = await call(fetchCollections, { perPage: 0 })
  if (!total) notFound()

  return OGTemplate.response(
    <OGTemplate.Root>
      <OGTemplate.Half>
        <OGTemplate.Title>
          <span>{total} Collections on</span>
          <span>Books About Food</span>
        </OGTemplate.Title>
      </OGTemplate.Half>
    </OGTemplate.Root>
  )
}
