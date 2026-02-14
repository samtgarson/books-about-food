import { ComponentProps } from 'react'
import ClaimApproved from './claim-approved'
import NewClaim from './new-claim'
import PublisherInvite from './publisher-invite'
import SubmissionPublished from './submission-published'
import SuggestEdit from './suggest-edit'
import UserApproved from './user-approved'
import VerifyEmail from './verify-email'
import VoteReminder from './vote-reminder'

export const EmailTemplateMap = {
  claimApproved: ClaimApproved,
  newClaim: NewClaim,
  submissionPublished: SubmissionPublished,
  suggestEdit: SuggestEdit,
  publisherInvite: PublisherInvite,
  userApproved: UserApproved,
  verifyEmail: VerifyEmail,
  voteReminder: VoteReminder
} as const

export type EmailTemplateMap = typeof EmailTemplateMap

export type EmailTemplateProps = {
  [K in keyof EmailTemplateMap]: {
    key: K
    props: Omit<ComponentProps<EmailTemplateMap[K]>, 'recipientName'>
  }
}

export type EmailTemplate = EmailTemplateProps[keyof EmailTemplateMap]
