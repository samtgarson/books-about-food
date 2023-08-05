import prisma from 'database'
import { notFound } from 'next/navigation'

export * from 'app/default-static-config'

// export const generateStaticParams = async () => {
//   const { publishers } = await fetchPublishers.call({
//     perPage: 0
//   })
//
//   return publishers.map((publisher) => ({
//     slug: publisher.slug
//   }))
// }

const fetchPublisher = async (slug: string) =>
  prisma.publisher.findUnique({
    where: { slug }
  })

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const publisher = await fetchPublisher(slug)
  if (!publisher) return notFound()

  return <div>{publisher.name}</div>
}
