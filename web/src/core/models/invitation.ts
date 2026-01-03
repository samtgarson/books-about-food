import type {
  PublisherInvitation as PayloadPublisherInvitation,
  User as PayloadUser
} from 'src/payload/payload-types'
import { MembershipRole } from './membership'
import { User } from './user'
import { requirePopulated } from './utils/payload-validation'

export class Invitation {
  public id: string
  public invitedBy: User
  public role: MembershipRole
  public email: string
  public createdAt: Date
  public acceptedAt?: Date

  constructor(attrs: PayloadPublisherInvitation) {
    // Validate required relationships are populated
    const invitedBy = requirePopulated<PayloadUser>(
      attrs.invitedBy,
      'Invitation.invitedBy'
    )

    this.id = attrs.id
    this.invitedBy = new User(invitedBy)
    this.role = attrs.role
    this.email = attrs.email
    this.createdAt = new Date(attrs.createdAt)
    this.acceptedAt = attrs.acceptedAt ? new Date(attrs.acceptedAt) : undefined
  }
}
