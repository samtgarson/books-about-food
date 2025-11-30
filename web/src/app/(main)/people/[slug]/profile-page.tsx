import { fetchFrequentCollaborators } from '@books-about-food/core/services/books/fetch-frequent-collaborators'
import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import cn from 'classnames'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { FavouriteButton } from 'src/components/favourites/favourite-button'
import { ClaimProfileButton } from 'src/components/profiles/claim-button'
import { ContributionList } from 'src/components/profiles/contribution-list'
import { EditProfileProvider } from 'src/components/profiles/edit/context'
import { EditableAvatar } from 'src/components/profiles/edit/editable-avatar'
import { Field } from 'src/components/profiles/edit/field'
import { FrequentCollaborators } from 'src/components/profiles/edit/frequent-collaborators'
import { LinkList } from 'src/components/profiles/link-list'
import { LocationField } from 'src/components/profiles/location-field'
import { ProfileOverflow } from 'src/components/profiles/profile-overflow'
import { Wrap } from 'src/components/utils/wrap'
import { call } from 'src/utils/service'

export type ProfilePageProps = {
  segment: 'authors' | 'people'
  slug: string
}
export async function ProfilePage({ segment, slug }: ProfilePageProps) {
  const [{ data: profile }, { data: collaborators = [] }] = await Promise.all([
    call(fetchProfile, { slug, onlyPublished: true }),
    call(fetchFrequentCollaborators, { slug })
  ])
  if (!profile) return notFound()

  return (
    <Wrap c={EditProfileProvider} profile={profile} segment={segment}>
      <Container
        belowNav
        id="container"
        className={cn(profile.claimed && 'edit-bg bg-white pb-8 sm:pb-20')}
      >
        <div className="pt-8 md:pt-20">
          <div className="relative flex flex-col items-stretch gap-6 lg:flex-row lg:items-start">
            <div className="w-full grow">
              <Field
                as="h1"
                attr="name"
                className="mr-auto items-center font-style-title"
              />
              <ClaimProfileButton className="mt-6 mb-10 w-full sm:hidden" />
              <Field
                attr="description"
                className="mt-4 max-w-prose text-16"
                placeholder="Add a description"
              />
              <div className="mt-8">
                <Field attr="jobTitle" detail placeholder="Add a job title" />
                <LocationField />
                <LinkList />
              </div>
            </div>
            <div className="order-first flex shrink-0 items-start justify-between gap-5 lg:order-last lg:flex-col lg:items-end">
              <EditableAvatar />
              <div className="flex items-center gap-2">
                <FavouriteButton profileId={profile.id} />
                <ClaimProfileButton className="hidden sm:flex" />
                <Wrap c={ProfileOverflow} profile={profile} />
              </div>
            </div>
          </div>
          <Wrap
            c={FrequentCollaborators}
            profiles={collaborators}
            className="my-4 sm:mt-20 sm:mb-0"
          />
        </div>
      </Container>
      <Container className="border-black empty:hidden max-sm:border-t">
        <Suspense fallback={null}>
          <ContributionList profile={profile} className="sm:mt-20" />
        </Suspense>
      </Container>
    </Wrap>
  )
}
