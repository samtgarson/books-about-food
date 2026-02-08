import type { Payload } from 'payload'
import { inngest } from 'src/jobs'
import { email } from './email'

export const sendVoteReminder = inngest.createFunction(
  { id: 'send-vote-reminder', name: 'Send vote reminder email' },
  { event: 'votes.created' },
  async ({
    step,
    event,
    payload
  }: {
    step: {
      waitForEvent: (
        id: string,
        opts: { event: string; timeout: string; match: string }
      ) => Promise<unknown>
      invoke: (
        id: string,
        opts: {
          function: typeof email
          data: Record<string, unknown>
          user: { email: string; name?: string | null }
        }
      ) => Promise<unknown>
    }
    event: {
      user?: { email: string; name?: string | null }
      data: { bookIds: string[] }
    }
    payload: Payload
  }) => {
    if (!event.user) return { success: false, message: 'No user found' }

    const superceded = await step.waitForEvent('vote-superceded', {
      event: 'votes.created',
      timeout: '6h',
      match: 'user.email'
    })

    if (superceded) return { success: true, message: 'Vote superceded' }

    const { totalDocs: submittedVotes } = await payload.count({
      collection: 'book-votes',
      where: { 'user.email': { equals: event.user.email } }
    })
    if (submittedVotes >= 3)
      return { success: true, message: 'Votes submitted, skipping email' }

    const result = await step.invoke('send-vote-reminder-email', {
      function: email,
      data: { key: 'voteReminder', props: {} },
      user: event.user
    })

    return {
      success: true,
      message: 'Vote reminder email sent',
      emailResult: result
    }
  }
)
