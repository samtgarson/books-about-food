import cn from 'classnames'
import { Avatar } from 'src/components/atoms/avatar'
import { Lock } from 'src/components/atoms/icons'
import { AuthedButton } from 'src/components/auth/authed-button'
import { GridContainer } from 'src/components/lists/grid-container'
import { ProfileItem } from '../../item'
import { dummyProfiles } from './dummy-data'

export function FrequentCollaboratorsDummy({
  className
}: {
  className?: string
}) {
  return (
    <div className={className}>
      <h2 className="all-caps mb-4 w-full text-left">Frequent Collaborators</h2>
      <div className="relative">
        <GridContainer
          className={cn(
            '-mt-px sm:mt-0 relative mobile-only:hidden blur-md opacity-30'
          )}
        >
          {dummyProfiles.map((profile) => (
            <div aria-hidden key={profile.id}>
              <ProfileItem display="list" profile={profile} />
            </div>
          ))}
        </GridContainer>
        <div className="sm:hidden flex gap-4 blur-md opacity-30">
          {dummyProfiles.map((profile) => (
            <Avatar profile={profile} key={profile.id} size="xs" />
          ))}
        </div>
        <div className="absolute inset-0 flex gap-4 items-center justify-center">
          <p className="sm:text-center text-14">
            Please{' '}
            <AuthedButton source="Frequent collaborators">
              <a className="underline">login</a>
            </AuthedButton>{' '}
            or{' '}
            <AuthedButton source="Frequent collaborators">
              <a className="underline">create a free account</a>
            </AuthedButton>{' '}
            to view collaborators
          </p>
          <Lock strokeWidth={1} className="sm:order-first shrink-0" />
        </div>
      </div>
    </div>
  )
}
