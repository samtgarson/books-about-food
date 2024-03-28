import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { Metadata, ResolvedMetadata } from 'next'
import { notFound } from 'next/navigation'
import { PageProps } from 'src/components/types'
import { genMetadata } from 'src/utils/metadata'
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
    return genMetadata(
      profile.name,
      `/${segment}/${profile.slug}`,
      await parent,
      {
        openGraph: {
          images: [
            {
              url: `/${segment}/${profile.slug}/og-image.png`,
              width: 1200,
              height: 630,
              alt: `${profile.name} on Books About Food`
            }
          ],
          type: 'profile',
          username: profile.instagram,
          firstName,
          lastName: names.join(' ')
        }
      }
    )
  }
