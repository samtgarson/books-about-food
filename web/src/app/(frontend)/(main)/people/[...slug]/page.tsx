import { Metadata, ResolvedMetadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchProfile } from 'src/core/services/profiles/fetch-profile'
import { fetchProfiles } from 'src/core/services/profiles/fetch-profiles'
import { genMetadata, profileTotal } from 'src/utils/metadata'
import { call } from 'src/utils/service'
import z from 'zod'
import { ProfilePage } from './profile-page'

export const dynamic = 'error'
export const revalidate = 3600
export const dynamicParams = true

const segmentsSchema = z
  .tuple([z.string(), z.optional(z.literal('edit'))])
  .transform(([slug, edit]) => ({ slug, editing: edit === 'edit' }))

function parseSlug(segments: string[]) {
  const res = segmentsSchema.safeParse(segments)
  if (!res.success) return notFound()
  return res.data
}

export default async function PeoplePage(props: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await props.params
  const { slug: profileSlug, editing } = parseSlug(slug)
  return <ProfilePage slug={profileSlug} editing={editing} />
}

export async function generateStaticParams() {
  const { data } = await call(fetchProfiles, {})

  return data?.profiles.map((profile) => ({ slug: [profile.slug] })) ?? []
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string[] }> },
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { slug: segments } = await props.params
  const slug = segments[0]
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
