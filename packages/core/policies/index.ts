/* eslint-disable @typescript-eslint/no-explicit-any */
import { FullBook } from '@books-about-food/core/models/full-book'
import { Profile } from '@books-about-food/core/models/profile'
import { Publisher } from '@books-about-food/core/models/publisher'
import { Team } from '@books-about-food/core/models/team'
import { User } from '@books-about-food/core/types'
import { BookPolicy } from './book-policy'
import { ProfilePolicy } from './profile-policy'
import { PublisherPolicy } from './publisher-policy'
import { TeamPolicy } from './team-policy'

export type PolicyFor<R> = R extends FullBook
  ? BookPolicy
  : R extends Profile
  ? ProfilePolicy
  : R extends Publisher
  ? PublisherPolicy
  : R extends Team
  ? TeamPolicy
  : never

export function can<R>(user: User, resource: R) {
  if (resource instanceof FullBook) {
    return new BookPolicy(user, resource) as PolicyFor<R>
  } else if (resource instanceof Profile) {
    return new ProfilePolicy(user, resource) as PolicyFor<R>
  } else if (resource instanceof Publisher) {
    return new PublisherPolicy(user, resource) as PolicyFor<R>
  } else if (resource instanceof Team) {
    return new TeamPolicy(user, resource) as PolicyFor<R>
  }

  throw new Error(`Unknown resource type: ${resource}`)
}
