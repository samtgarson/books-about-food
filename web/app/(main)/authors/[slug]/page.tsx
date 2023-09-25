import { ProfilePage } from 'app/(main)/people/[slug]/profile-page'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageProps } from 'src/components/types'
import { fetchProfile } from 'src/services/profiles/fetch-profile'

type ProfilePageProps = PageProps<{ slug: string }>

export async function generateMetadata({
  params: { slug }
}: ProfilePageProps): Promise<Metadata> {
  const profile = await fetchProfile.call({ slug })
  if (!profile) notFound()

  return { title: profile.name }
}

export * from 'app/default-static-config'

export default function PeoplePage({ params: { slug } }: ProfilePageProps) {
  return <ProfilePage segment="authors" slug={slug} />
}
