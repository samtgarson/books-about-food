import { Container } from 'src/components/atoms/container'
import { ItemCarousel } from 'src/components/books/item-carousel'
import { FeatureCarousel } from 'src/components/feature-carousel'
import { fetchFeatures } from 'src/services/features/fetch-features'
import { fetchHome } from 'src/services/home/fetch'
import { PublisherGrid } from './publishers/grid'
import { HomepageModule } from 'src/components/home/module'
import { ProfileCarousel } from 'src/components/profiles/profile-carousel'
import { Marquee } from 'src/components/atoms/marquee'
import { FeaturedJobsList } from 'src/components/jobs/featured-jobs-list'
import { Suspense } from 'react'

export * from 'app/default-static-config'

const Page = async () => {
  const [features, home] = await Promise.all([
    fetchFeatures.call(),
    fetchHome.call()
  ])

  return (
    <>
      <FeatureCarousel features={features} data-superjson />
      <Marquee>
        Welcome to the cookbook industry’s new digital home—a creative platform
        showcasing the work of authors and publishers alongside the network of
        people essential in the creation of cookbooks.
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
              readMoreLink="/cookbooks"
              className="lg:py-10 -mx-8 lg:-mx-12 xl:-mx-16"
              centered
              startOn={1}
              data-superjson
            />
          </HomepageModule>
          <HomepageModule
            title="Author Spotlight"
            action={{ href: '/authors', label: 'View More' }}
          >
            <ProfileCarousel
              items={home.authors}
              data-superjson
              className="-mx-8 lg:-mx-12 xl:-mx-16 py-12 lg:pb-20 lg:pt-[93px]"
            />
          </HomepageModule>
        </div>
        <ItemCarousel
          items={home.newlyAdded}
          title="On The Pass"
          size="lg"
          readMoreLink="/cookbooks"
          className="pt-12 md:pt-20"
          data-superjson
        />
      </Container>
      <Container className="flex flex-col gap-24 md:gap-40 py-12 md:py-20">
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
