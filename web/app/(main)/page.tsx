import { Container } from 'src/components/atoms/container'
import { ItemCarousel } from 'src/components/books/item-carousel'
import { FeatureCarousel } from 'src/components/home/feature-carousel'
import { fetchFeatures } from 'src/services/features/fetch-features'
import { fetchHome } from 'src/services/home/fetch'

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
          className="my-20"
          data-superjson
        />
        <ItemCarousel
          items={home.newlyAdded}
          title="On The Pass"
          size="lg"
          readMoreLink="/cookbooks"
          className="my-20"
          data-superjson
        />
      </Container>
    </>
  )
}

export default Page
