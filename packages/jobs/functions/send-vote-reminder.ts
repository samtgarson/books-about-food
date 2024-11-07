import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { email } from './email'

export const sendVoteReminder = inngest.createFunction(
  { id: 'send-vote-reminder', name: 'Send vote reminder email' },
  { event: 'votes.created' },
  async ({ step, event }) => {
    const superceded = await step.waitForEvent('vote-superceded', {
      event: 'votes.created',
      timeout: '1m',
      match: 'data.userId'
    })

    if (superceded) return { success: true, message: 'Vote superceded' }
    const submittedVotes = await prisma.bookVote.count({
      where: { userId: event.data.userId }
    })
    if (submittedVotes >= 3)
      return { success: true, message: 'Votes submitted, skipping email' }

    const result = await step.invoke('send-vote-reminder-email', {
      function: email,
      data: { key: 'voteReminder', props: undefined },
      user: event.user
    })

    return {
      success: true,
      message: 'Vote reminder email sent',
      emailResult: result
    }
  }
)
