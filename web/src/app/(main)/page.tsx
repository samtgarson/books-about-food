import { fetchFeatures } from '@books-about-food/core/services/features/fetch-features'
import { fetchHome } from '@books-about-food/core/services/home/fetch'
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
import { call } from 'src/utils/service'
import { PublisherGrid } from './publishers/grid'

export * from 'app/default-static-config'

const Page = async () => {
  const [{ data: features }, { data: home }] = await Promise.all([
    call(fetchFeatures),
    call(fetchHome)
  ])
  if (!features || !home) throw new Error('Server error')

  return (
    <>
      <FeatureCarousel features={features} title data-superjson />
      <Marquee className="fixed bottom-0 left-0 -right-[25%] z-40 -rotate-[15deg]">
        <a
          href="https://www.instagram.com/books.about.food"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on Instagram
        </a>
        <NewBookButton className="text-white">Submit a cookbook</NewBookButton>
      </Marquee>
      <Container
        mobile={false}
        desktop={false}
        belowNav={!features.length}
        className="-mt-px"
      >
        <div className="flex flex-wrap">
          <HomepageModule
            title="Coming Soon"
            action={{ href: '/cookbooks', label: 'View More' }}
          >
            <ItemCarousel
              items={home.comingSoon}
              size="xl"
              className="-mx-8 lg:-mx-12 lg:pt-10 lg:pb-6 xl:-mx-16"
              centered
              startOn={1}
              data-superjson
            />
          </HomepageModule>
          <HomepageModule
            title="Author Spotlight"
            action={{ href: '/authors', label: 'View More' }}
            className="bg-khaki"
          >
            <ProfileCarousel
              items={home.authors}
              data-superjson
              className="-mx-8 py-12 lg:-mx-12 lg:pb-16 lg:pt-[93px] xl:-mx-16"
            />
          </HomepageModule>
        </div>
        <USP />
        <ItemCarousel
          items={home.newlyAdded}
          title="On The Pass"
          size="lg"
          readMoreLink="/cookbooks"
          className="pt-12 md:pt-20"
          colorful
          data-superjson
        />
      </Container>
      <Container className="flex flex-col gap-24 py-12 md:gap-40 md:py-20">
        <div>
          <h3 className="all-caps mb-6 md:mb-8">People Directory</h3>
          <Suspense fallback={null}>
            <FeaturedJobsList />
          </Suspense>
        </div>
        <div>
          <h3 className="all-caps mb-6 md:mb-8">Top Publishers</h3>
          <PublisherGrid
            publishers={home.publishers}
            square={false}
            viewMoreLink={{ path: '/publishers', label: 'View All' }}
          />
        </div>
      </Container>
    </>
  )
}

export default Page
