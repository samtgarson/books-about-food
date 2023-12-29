import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { CollectionCustomizer } from '@forestadmin/agent'
import { resourceAction } from 'lib/utils/actions'
import { Schema } from '../../.schema/types'

export const customiseVerificationTokens = (
  collection: CollectionCustomizer<Schema, 'verification_tokens'>
) => {
  resourceAction({
    collection,
    name: '🔑 Resend verification email',
    successMessage: 'Verification email sent! 📬',
    fn: async (token: string | number) => {
      const { identifier: email } =
        await prisma.verificationToken.findUniqueOrThrow({
          where: { token: token.toString() }
        })

      inngest.send({
        name: 'jobs.send-verification',
        data: { email }
      })
    }
  })
}
