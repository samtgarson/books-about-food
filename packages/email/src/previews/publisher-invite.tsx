import { PublisherInvite } from '../templates/publisher-invite'

export function preview() {
  return new PublisherInvite({
    publisherName: 'Super Awesome Publisher',
    inviterName: 'Sam Garson'
  }).render('Jamin')
}
