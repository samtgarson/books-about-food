import { Team } from '@books-about-food/core/models/team'
import { Policy } from './base'

export class TeamPolicy extends Policy<Team> {
  get update() {
    return (
      this.resource.memberships.find((m) => m.userId === this.user.id)?.role ===
      'admin'
    )
  }
}
