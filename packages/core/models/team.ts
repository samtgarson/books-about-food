import { Membership, TeamInvitation } from '@books-about-food/database'
import { Publisher } from './publisher'
import { TeamAttrs } from './types'
import { User } from './user'

export class Team {
  id: string
  name: string
  slug: string
  memberships: Array<Membership & { user: User }>
  invitations: Array<TeamInvitation & { invitedBy: User }>
  publishers: Publisher[]

  constructor(attrs: TeamAttrs) {
    this.id = attrs.id
    this.memberships = attrs.memberships.map((m) => ({
      ...m,
      user: new User(m.user)
    }))
    this.invitations = attrs.invitations.map((i) => ({
      ...i,
      invitedBy: new User(i.invitedBy)
    }))
    this.name = attrs.name
    this.slug = attrs.slug
    this.publishers = attrs.publishers.map((p) => new Publisher(p))
  }

  userRole(userId: string) {
    return this.memberships.find((m) => m.userId === userId)?.role ?? null
  }
}
