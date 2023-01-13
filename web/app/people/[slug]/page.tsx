import prisma from 'database'
import { notFound } from 'next/navigation'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'

export const generateStaticParams = async () => {
  const { profiles } = await fetchProfiles.call({
    perPage: 0
  })

  return profiles.map((profile) => ({
    slug: profile.slug
  }))
}

const fetchProfile = async (slug: string) =>
  prisma.profile.findUnique({
    where: { slug }
  })

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const profile = await fetchProfile(slug)
  if (!profile) return notFound()

  return <div>{profile.name}</div>
}
