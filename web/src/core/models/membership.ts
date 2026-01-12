import type {
  Membership as PayloadMembership,
  User as PayloadUser
} from 'src/payload/payload-types'
import { MembershipRole } from './types'
import { User } from './user'
import { requirePopulated } from './utils/payload-validation'

export class Membership {
  public id: string
  public user: User
  public role: MembershipRole

  constructor(attrs: PayloadMembership) {
    // Validate required relationships are populated
    const user = requirePopulated<PayloadUser>(attrs.user, 'Membership.user')

    this.id = attrs.id
    this.user = new User(user)
    this.role = attrs.role
  }
}
