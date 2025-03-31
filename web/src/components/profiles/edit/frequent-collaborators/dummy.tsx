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
            'relative -mt-px opacity-30 blur-md sm:mt-0 mobile-only:hidden'
          )}
        >
          {dummyProfiles.map((profile) => (
            <div aria-hidden key={profile.id}>
              <ProfileItem display="list" profile={profile} />
            </div>
          ))}
        </GridContainer>
        <div className="flex gap-4 opacity-30 blur-md sm:hidden">
          {dummyProfiles.map((profile) => (
            <Avatar profile={profile} key={profile.id} size="xs" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <p className="text-14 sm:text-center">
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
          <Lock strokeWidth={1} className="shrink-0 sm:order-first" />
        </div>
      </div>
    </div>
  )
}
