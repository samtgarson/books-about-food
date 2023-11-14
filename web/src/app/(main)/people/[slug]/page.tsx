import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'
import { ProfilePage } from './profile-page'

type ProfilePageProps = PageProps<{ slug: string }>

export async function generateMetadata({
  params: { slug }
}: ProfilePageProps): Promise<Metadata> {
  const { data: profile } = await call(fetchProfile, { slug })
  if (!profile) notFound()

  return { title: profile.name }
}

export * from 'app/default-static-config'

export default function PeoplePage({ params: { slug } }: ProfilePageProps) {
  return <ProfilePage segment="people" slug={slug} />
}
