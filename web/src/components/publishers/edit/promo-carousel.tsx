'use client'

import { Promo } from '@books-about-food/core/models/promo'
import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { AntiContainer } from 'src/components/atoms/container'
import { Edit2, Plus } from 'src/components/atoms/icons'
import { mouseAttrs } from 'src/components/atoms/mouse'
import { SheetButton } from 'src/components/atoms/sheet/button'
import { Bookshelf } from 'src/components/books/bookshelf'
import { FeatureCarousel } from 'src/components/feature-carousel'
import { FeatureCarouselSlide } from 'src/components/feature-carousel/slide'
import { FeatureCarouselTitleProps } from 'src/components/feature-carousel/title'
import { useFeatureCarouselItem } from 'src/components/feature-carousel/use-feature-carousel-item'
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
    <AntiContainer className="-mt-56 relative">
      <FeatureCarousel
        features={features}
        title={PromoTitleSlide}
        className="h-[80vh] max-h-[700px]"
      />
      {editMode && (
        <div className="animate-fade-in absolute inset-0 z-[21] bg-opacity-50 backdrop-blur-lg flex items-center justify-center lg:-mb-20">
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
      {promo ? 'Edit Promo Carousel' : 'Add Promo Carousel'}
    </SheetButton>
  )
}

function PromoTitleSlide({
  id,
  index,
  currentIndex,
  onClick
}: FeatureCarouselTitleProps) {
  const { promo } = useEditPublisher()
  const { position, display, attrs, current, className, mouseProps } =
    useFeatureCarouselItem({
      index,
      currentIndex,
      centered: false,
      imageWidth: 100,
      title: true
    })

  if (!promo || !display) return
  return (
    <FeatureCarouselSlide
      id={id}
      key={id}
      {...attrs}
      className={cn(
        className,
        'justify-center lg:justify-between',
        !current && 'cursor-pointer'
      )}
      onClick={onClick}
      position={position}
      {...mouseAttrs({
        ...mouseProps,
        mode: mouseProps.mode === 'clickable' ? 'default' : mouseProps.mode
      })}
    >
      <h1
        className={cn(
          'text-48 w-full lg:w-1/2 max-w-xl transition-opacity duration-300',
          !current && 'opacity-10'
        )}
      >
        {promo.title}
      </h1>
      <AnimatePresence>
        {current && (
          <motion.div
            className="grow h-full relative items-end justify-center hidden lg:flex -mb-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Bookshelf books={promo.books} />
          </motion.div>
        )}
      </AnimatePresence>
    </FeatureCarouselSlide>
  )
}
