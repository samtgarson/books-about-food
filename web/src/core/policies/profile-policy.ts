import { Profile } from 'src/core/models/profile'
import { Policy } from './base'

export class ProfilePolicy extends Policy<Profile> {
  get update() {
    return this.user.role === 'admin' || this.user.id === this.resource.id
  }
}
