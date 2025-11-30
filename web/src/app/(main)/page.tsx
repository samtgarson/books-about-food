import { fetchFeatures } from '@books-about-food/core/services/features/fetch-features'
import { fetchHome } from '@books-about-food/core/services/home/fetch'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { ItemCarousel } from 'src/components/books/item-carousel'
import { FeatureCarousel } from 'src/components/feature-carousel'
import { HomepageLinks } from 'src/components/home/links'
import { HomepageModule } from 'src/components/home/module'
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
  const { data: features } = await call(fetchFeatures, undefined)

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
      <Suspense fallback={null}>
        <HomepageContent />
      </Suspense>
    </>
  )
}

async function HomepageContent() {
  const { data: home } = await call(fetchHome, undefined)
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
              className="-mx-8 lg:-mx-12 lg:pt-10 lg:pb-6 xl:-mx-16"
              centered
              startOn={1}
            />
          </HomepageModule>
          <HomepageModule
            title="People Spotlight"
            action={{ href: '/people', label: 'View More' }}
            className="bg-khaki"
          >
            <Wrap
              c={ProfileCarousel}
              items={home.people}
              className="-mx-8 py-12 lg:-mx-12 lg:pt-[93px] lg:pb-16 xl:-mx-16"
            />
          </HomepageModule>
        </div>
        <HomepageLinks />
      </Container>
      <Container className="flex flex-col md:pt-20">
        <p className="max-w-4xl py-16 text-24 md:py-20 md:text-48">
          Beautifully designed cookbooks and the people making them
        </p>
        <div>
          <h3 className="mb-6 all-caps md:mb-8">People Directory</h3>
          <Suspense fallback={null}>
            <FeaturedJobsList />
          </Suspense>
        </div>
      </Container>
      <Container className="-mt-px" left={false} right={false}>
        <Wrap
          c={ItemCarousel}
          items={home.newlyAdded}
          title="On The Pass"
          size="lg"
          readMoreLink="/cookbooks"
          className="pt-12 md:pt-20"
          inContainer
          colorful
        />
      </Container>
    </>
  )
}

export default Page
