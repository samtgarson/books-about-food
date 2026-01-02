import { Collection } from '../models/collection'
import { Policy } from './base'

export class CollectionPolicy extends Policy<Collection> {
  get update() {
    if (this.user.role === 'admin') return true

    if (!this.resource.publisherId) return false
    return this.user.publishers.includes(this.resource.publisherId)
  }
}
