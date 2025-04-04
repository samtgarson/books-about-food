import { fetchFeatures } from '@books-about-food/core/services/features/fetch-features'
import { fetchHome } from '@books-about-food/core/services/home/fetch'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Marquee } from 'src/components/atoms/marquee'
import { ItemCarousel } from 'src/components/books/item-carousel'
import { NewBookButton } from 'src/components/books/new-book-button'
import { FeatureCarousel } from 'src/components/feature-carousel'
import { HomepageModule } from 'src/components/home/module'
import { USP } from 'src/components/home/usp'
import { FeaturedJobsList } from 'src/components/jobs/featured-jobs-list'
import { ProfileCarousel } from 'src/components/profiles/profile-carousel'
import { Wrap } from 'src/components/utils/wrap'
import { call } from 'src/utils/service'

// const EditFeatureCarouselDialog = dynamic(
//   async () =>
//     (await import('src/components/feature-carousel/edit-dialog'))
//       .EditFeatureCarouselDialog,
//   { ssr: false }
// )

export const dynamic = 'error'
export const revalidate = 3600

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
}

async function Page() {
  const { data: features } = await call(fetchFeatures)

  return (
    <>
      {features && (
        <div className="relative bg-white">
          <Wrap
            c={FeatureCarousel}
            features={features}
            title
            faces
            className="h-[90vh] max-h-[800px] overflow-y-hidden"
          />
        </div>
      )}
      <Marquee className="fixed -right-[25%] bottom-0 left-0 z-40 -rotate-[15deg]">
        <a
          href="https://www.instagram.com/booksabout.food"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on Instagram
        </a>
        <NewBookButton className="text-white">Submit a cookbook</NewBookButton>
      </Marquee>
      <Suspense fallback={null}>
        <HomepageContent />
      </Suspense>
    </>
  )
}

async function HomepageContent() {
  const { data: home } = await call(fetchHome)
  if (!home) return null

  return (
    <>
      <Container mobile={false} desktop={false} className="-mt-px">
        <div className="flex flex-wrap">
          <HomepageModule
            title="Coming Soon"
            action={{ href: '/cookbooks', label: 'View More' }}
          >
            <Wrap
              c={ItemCarousel}
              items={home.comingSoon}
              size="xl"
              className="-mx-8 lg:-mx-12 lg:pb-6 lg:pt-10 xl:-mx-16"
              centered
              startOn={1}
            />
          </HomepageModule>
          <HomepageModule
            title="Author Spotlight"
            action={{ href: '/authors', label: 'View More' }}
            className="bg-khaki"
          >
            <Wrap
              c={ProfileCarousel}
              items={home.authors}
              className="-mx-8 py-12 lg:-mx-12 lg:pb-16 lg:pt-[93px] xl:-mx-16"
            />
          </HomepageModule>
        </div>
        <USP />
        <Wrap
          c={ItemCarousel}
          items={home.newlyAdded}
          title="On The Pass"
          size="lg"
          readMoreLink="/cookbooks"
          className="pt-12 md:pt-20"
          colorful
        />
      </Container>
      <Container className="flex flex-col gap-24 py-12 md:gap-40 md:py-20">
        <div>
          <h3 className="all-caps mb-6 md:mb-8">People Directory</h3>
          <Suspense fallback={null}>
            <FeaturedJobsList />
          </Suspense>
        </div>
      </Container>
    </>
  )
}

export default Page
