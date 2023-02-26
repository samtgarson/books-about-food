import { Container } from 'src/components/atoms/container'
import { ItemCarousel } from 'src/components/books/item-carousel'
import { FeatureCarousel } from 'src/components/home/feature-carousel'
import { fetchFeatures } from 'src/services/features/fetch-features'
import { fetchHome } from 'src/services/home/fetch'
import { PeopleGrid } from './people/grid'
import { PublisherGrid } from './publishers/grid'

const Page = async () => {
  const [features, home] = await Promise.all([
    fetchFeatures.call(),
    fetchHome.call()
  ])

  return (
    <>
      <FeatureCarousel features={features} data-superjson />
      <Container mobile={false} desktop={false} belowNav={!features.length}>
        <ItemCarousel
          items={home.comingSoon}
          title="Coming Soon"
          size="xl"
          readMoreLink="/cookbooks"
          className="pt-12 md:pt-20 md:pb-2"
          data-superjson
        />
        <ItemCarousel
          items={home.newlyAdded}
          title="On The Pass"
          size="lg"
          readMoreLink="/cookbooks"
          className="pt-12 md:pt-20"
          data-superjson
        />
        <p className="pt-8 md:pt-24 mb-24 md:mb-40 text-32 md:text-48 md:text-justify indent-28 md:indent-40">
          An independent creative platform showcasing a curated collection of
          books about food. A single space for publishers and authors to promote
          their published cookbooks and new releases—alongside a directory of
          the people involved in making them.
        </p>
      </Container>
      <Container className="py-12 md:py-20">
        <h3 className="all-caps mb-6 md:mb-8">Featured People</h3>
        <PeopleGrid
          profiles={home.people}
          viewMoreLink={{ path: '/authors', label: 'View Others' }}
        />
      </Container>
      <Container className="pt-12 md:pt-20 -mb-20 sm:mb-0">
        <h3 className="all-caps mb-6 md:mb-8">Top Publishers</h3>
        <PublisherGrid
          publishers={home.publishers}
          square={false}
          viewMoreLink={{ path: '/publishers', label: 'View All' }}
        />
      </Container>
    </>
  )
}

export default Page
