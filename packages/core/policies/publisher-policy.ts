import { Publisher } from '@books-about-food/core/models/publisher'
import { Policy } from './base'

export class PublisherPolicy extends Policy<Publisher> {
  get update() {
    return (
      this.user.role === 'admin' ||
      this.user.publishers.includes(this.resource.id)
    )
  }
}
