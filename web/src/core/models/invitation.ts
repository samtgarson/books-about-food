import { MembershipRole } from '@books-about-food/database'
import { InvitationAttrs } from './types'
import { User } from './user'

export class Invitation {
  public id: string
  public invitedBy: User
  public role: MembershipRole
  public email: string
  public createdAt: Date
  public acceptedAt?: Date

  constructor(attrs: InvitationAttrs) {
    this.id = attrs.id
    this.invitedBy = new User(attrs.invitedBy)
    this.role = attrs.role
    this.email = attrs.email
    this.createdAt = attrs.createdAt
    this.acceptedAt = attrs.acceptedAt || undefined
  }
}
