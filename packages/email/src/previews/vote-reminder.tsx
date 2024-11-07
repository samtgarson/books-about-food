import { VoteReminder } from '../templates/vote-reminder'

export function preview() {
  return new VoteReminder(undefined).render('Jamin')
}
