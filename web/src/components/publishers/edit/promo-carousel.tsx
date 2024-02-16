'use client'

import { Promo } from '@books-about-food/core/models/promo'
import cn from 'classnames'
import { Edit2, Plus } from 'react-feather'
import { AntiContainer } from 'src/components/atoms/container'
import { SheetButton } from 'src/components/atoms/sheet/button'
import { FeatureCarousel } from 'src/components/feature-carousel'
import { useEditPublisher } from './context'

export function PromoCarousel() {
  const { editMode, publisher, promo } = useEditPublisher()

  if (!promo) {
    if (!editMode) return null
    return (
      <CreatePromoButton
        slug={publisher.slug}
        className="w-full justify-start h-32 mb-16"
      />
    )
  }

  const features = promo.books.map((book) => ({
    id: book.id,
    book,
    title: book.title,
    description: book.subtitle
  }))
  return (
    <AntiContainer className="-mt-36 relative">
      <FeatureCarousel features={features} />
      {editMode && (
        <div className="animate-fade-in absolute inset-0 z-[21] bg-opacity-50 backdrop-blur-lg flex items-center justify-center">
          <CreatePromoButton slug={publisher.slug} promo={promo} />
        </div>
      )}
    </AntiContainer>
  )
}

function CreatePromoButton({
  slug,
  promo,
  className
}: {
  slug: string
  promo?: Promo
  className?: string
}) {
  return (
    <SheetButton
      sheet="editPromo"
      props={{ publisherSlug: slug, promo }}
      className={cn('flex items-center', className)}
    >
      {promo ? <Edit2 strokeWidth={1} /> : <Plus strokeWidth={1} />}
      {promo ? 'Edit Header Carousel' : 'Add Header Carousel'}
    </SheetButton>
  )
}
