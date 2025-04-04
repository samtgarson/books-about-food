import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { Metadata, ResolvedMetadata } from 'next'
import { notFound } from 'next/navigation'
import { SlugProps } from 'src/components/types'
import { genMetadata, profileTotal } from 'src/utils/metadata'
import { call } from 'src/utils/service'
import { ProfilePageProps } from './profile-page'

export const metadata = (segment: ProfilePageProps['segment']) =>
  async function generateMetadata(
    props: SlugProps,
    parent: Promise<ResolvedMetadata>
  ): Promise<Metadata> {
    const { slug } = await props.params
    const [{ data: profile }, total] = await Promise.all([
      call(fetchProfile, { slug }),
      profileTotal
    ])
    if (!profile) notFound()

    const [firstName, ...names] = profile.name.split(' ')
    return genMetadata(`/${segment}/${profile.slug}`, await parent, {
      title: profile.name,
      description: `View ${profile.name}’s cookbooks and ${total} other profiles on Books About Food — the cookbook industry’s new digital home.`,
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
    })
  }
