import { Publisher } from '@books-about-food/core/models/publisher'
import { Policy } from './base'

export class PublisherPolicy extends Policy<Publisher> {
  get update() {
    return (
      this.user.role === 'admin' ||
      (!!this.resource.teamId && this.user.teams.includes(this.resource.teamId))
    )
  }
}
