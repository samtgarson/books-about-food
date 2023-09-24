import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Loader } from 'src/components/atoms/loader'
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
import { fetchFrequentCollaborators } from 'src/services/books/fetch-frequent-collaborators'
import { fetchProfile } from 'src/services/profiles/fetch-profile'

export type ProfilePageProps = {
  segment: 'authors' | 'people'
  slug: string
}
export async function ProfilePage({ segment, slug }: ProfilePageProps) {
  const [profile, collaborators] = await Promise.all([
    fetchProfile.call({ slug }),
    fetchFrequentCollaborators.call({ slug })
  ])
  if (!profile) return notFound()

  return (
    <EditProfileProvider profile={profile} segment={segment} data-superjson>
      <Container belowNav id="container">
        <div className="py-8 md:py-20">
          <div className="relative flex flex-col items-stretch gap-6 lg:flex-row lg:items-start">
            <div className="w-full flex-grow">
              <Field
                as="h1"
                attr="name"
                className="font-style-title mr-auto items-center"
              />
              <ClaimProfileButton
                data-superjson
                profile={profile}
                className="mb-10 mt-6 w-full sm:hidden"
              />
              <Field
                attr="description"
                className="text-16 mt-4 max-w-prose"
                placeholder="Add a description"
              />
              <div className="mt-8">
                <Field attr="jobTitle" detail placeholder="Add a job title" />
                <LocationField />
                <LinkList />
              </div>
            </div>
            <div className="order-first flex flex-shrink-0 items-start justify-between gap-5 lg:order-last lg:flex-col lg:items-end">
              <EditableAvatar />
              <div className="flex items-center gap-2">
                <FavouriteButton profileId={profile.id} />
                <ClaimProfileButton
                  data-superjson
                  profile={profile}
                  className="hidden sm:flex"
                />
                <ProfileOverflow profile={profile} data-superjson />
              </div>
            </div>
          </div>
          {collaborators.length > 0 && (
            <FrequentCollaborators
              data-superjson
              profiles={collaborators}
              className="mt-4 sm:mt-20"
            />
          )}
        </div>
        <Suspense fallback={<Loader />}>
          <ContributionList profile={profile} className="mt-8 sm:mt-20" />
        </Suspense>
      </Container>
    </EditProfileProvider>
  )
}
