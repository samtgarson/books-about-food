import { MembershipRole } from '@books-about-food/database'
import { MembershipAttrs } from './types'
import { User } from './user'

export class Membership {
  public id: string
  public user: User
  public role: MembershipRole

  constructor(attrs: MembershipAttrs) {
    this.id = attrs.id
    this.user = new User(attrs.user)
    this.role = attrs.role
  }
}
