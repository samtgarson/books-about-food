import { FeatureCarousel } from 'src/components/home/feature-carousel'
import { fetchFeatures } from 'src/services/features/fetch-features'

const Page = async () => {
  const [features] = await Promise.all([fetchFeatures.call()])

  return (
    <>
      <FeatureCarousel features={features} data-superjson />
    </>
  )
}

export default Page
