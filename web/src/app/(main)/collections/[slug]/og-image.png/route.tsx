import { fetchCollection } from '@books-about-food/core/services/collections/fetch-collection'
import Color from 'color'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'
import { PageProps } from 'src/components/types'
import { OGTemplate } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

type CollectionPageProps = PageProps<{ slug: string }>

export async function GET(_request: NextRequest, props: CollectionPageProps) {
  const { slug } = await props.params

  const { data: collection } = await call(fetchCollection, { slug })
  if (!collection) notFound()

  return OGTemplate.response(
    <OGTemplate.Root>
      <OGTemplate.Half>
        <OGTemplate.Title style={{ color: '#A5A5A4' }}>
          Cookbook Collection
        </OGTemplate.Title>
        <OGTemplate.Title>{collection.title}</OGTemplate.Title>
      </OGTemplate.Half>
      <OGTemplate.Half right style={{ flexWrap: 'wrap' }}>
        {collection.colors.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: color ? new Color(color).hex() : '#f0eeeb',
              width: 71,
              height: 71,
              borderRadius: 71
            }}
          />
        ))}
      </OGTemplate.Half>
    </OGTemplate.Root>
  )
}
