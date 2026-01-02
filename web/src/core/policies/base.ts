import { User } from 'src/core/types'

export class Policy<Resource> {
  constructor(
    protected user: User,
    protected resource: Resource
  ) {}
}
