import { Metadata, ResolvedMetadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchProfile } from 'src/core/services/profiles/fetch-profile'
import { genMetadata, profileTotal } from 'src/utils/metadata'
import { call } from 'src/utils/service'

export const metadata = () =>
  async function generateMetadata(
    props: PageProps<'/people/[slug]'>,
    parent: Promise<ResolvedMetadata>
  ): Promise<Metadata> {
    const { slug } = await props.params
    const [{ data: profile }, total] = await Promise.all([
      call(fetchProfile, { slug }),
      profileTotal()
    ])
    if (!profile) notFound()

    const [firstName, ...names] = profile.name.split(' ')
    return genMetadata(`/people/${profile.slug}`, await parent, {
      title: profile.name,
      description: `View ${profile.name}’s cookbooks and ${total} other profiles on Books About Food — beautifully designed cookbooks and the people making them.`,
      openGraph: {
        images: [
          {
            url: `/people/${profile.slug}/og-image.png`,
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
