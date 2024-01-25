import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import { Lock } from 'react-feather'
import { AuthedButton } from 'src/components/auth/authed-button'
import { GridContainer } from 'src/components/lists/grid-container'
import { getUser } from 'src/utils/user'
import { ProfileItem } from '../../item'
import { FrequentCollaboratorsClient } from './client'
import { dummyProfiles } from './dummy'

export type FrequentCollaboratorsProps = {
  className?: string
  profiles: Profile[]
}

export async function FrequentCollaborators({
  className,
  profiles
}: FrequentCollaboratorsProps) {
  const user = await getUser()

  if (user)
    return (
      <FrequentCollaboratorsClient
        profiles={profiles}
        className={className}
        data-superjson
      />
    )

  return (
    <div className={className}>
      <h2 className="all-caps mb-4 w-full text-left">Frequent Collaborators</h2>
      <GridContainer className={cn('-mt-px sm:mt-0 relative')}>
        {dummyProfiles.map((profile) => (
          <div aria-hidden key={profile.id}>
            <ProfileItem
              display="list"
              profile={profile}
              className="blur-md opacity-30"
            />
          </div>
        ))}
        <div className="absolute inset-0 flex gap-4 items-center justify-center text-16">
          <Lock strokeWidth={1} />
          <p className="text-center text-22">
            Please{' '}
            <AuthedButton>
              <a className="underline">login</a>
            </AuthedButton>{' '}
            or{' '}
            <AuthedButton>
              <a className="underline">create a free account</a>
            </AuthedButton>{' '}
            to view collaborators
          </p>
        </div>
      </GridContainer>
    </div>
  )
}
