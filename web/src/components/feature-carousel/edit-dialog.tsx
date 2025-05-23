'use client'

import { Feature } from '@books-about-food/core/services/features/fetch-features'
import { Reorder } from 'framer-motion'
import { useState } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { Menu } from '../atoms/icons'
import { MiniItem } from '../books/mini-item'
import { Form } from '../form'
import { Submit } from '../form/submit'
import { updateFeatureCarousel } from './action'

export function EditFeatureCarouselDialog({
  features: initialFeatures
}: {
  features: Feature[]
}) {
  const [features, setFeatures] = useState(initialFeatures)

  return (
    <Sheet.Root>
      <Sheet.Trigger className="absolute bottom-4 left-4 bg-white px-4 py-3">
        Edit Carousel
      </Sheet.Trigger>
      <Sheet.Content title="Edit Feauture Carousel">
        <Form
          action={async function () {
            await updateFeatureCarousel(features.map((f) => f.id))
          }}
        >
          <Sheet.Body>
            <Reorder.Group axis="y" values={features} onReorder={setFeatures}>
              {features.map((feature) => (
                <Reorder.Item
                  key={feature.id}
                  value={feature}
                  className="flex cursor-grab items-center gap-2 bg-white active:cursor-grabbing"
                >
                  <Menu strokeWidth={1} size={15} />
                  <MiniItem
                    book={feature.book}
                    className="pointer-events-none grow"
                  >
                    <p />
                  </MiniItem>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </Sheet.Body>
          <Sheet.Footer>
            <Submit className="w-full">Save</Submit>
          </Sheet.Footer>
        </Form>
      </Sheet.Content>
    </Sheet.Root>
  )
}
