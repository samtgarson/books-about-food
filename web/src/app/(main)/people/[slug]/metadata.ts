import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { Metadata, ResolvedMetadata } from 'next'
import { notFound } from 'next/navigation'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'
import { ProfilePageProps } from './profile-page'

export const metadata = (segment: ProfilePageProps['segment']) =>
  async function generateMetadata(
    { params: { slug } }: PageProps<{ slug: string }>,
    parent: Promise<ResolvedMetadata>
  ): Promise<Metadata> {
    const { data: profile } = await call(fetchProfile, { slug })
    if (!profile) notFound()

    const [firstName, ...names] = profile.name.split(' ')
    return {
      title: profile.name,
      alternates: {
        canonical: `/${segment}/${profile.slug}`
      },
      openGraph: {
        ...(await parent).openGraph,
        images: [
          {
            url: `/${segment}/${profile.slug}/og-image.png`,
            width: 1200,
            height: 630,
            alt: `${profile.name} on Books About Food`
          }
        ],
        title: profile.name,
        description: profile.jobTitle,
        type: 'profile',
        url: `https://booksaboutfood.info/${segment}/${profile.slug}`,
        username: profile.instagram,
        firstName,
        lastName: names.join(' ')
      }
    }
  }
