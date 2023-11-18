import { MjmlColumn, MjmlSection } from '@faire/mjml-react'
import { Template } from 'mailing-core'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import Text from '../components/text'
import { colors } from '../theme'

export type NewClaimProps = {
  recipientName: string
  claimId: string
  resourceName: string
  resourceAvatar: string | null
  userEmail: string
}

export const NewClaim: Template<NewClaimProps> = ({
  claimId,
  resourceName,
  resourceAvatar,
  recipientName,
  userEmail
}) => {
  return (
    <BaseLayout recipientName={recipientName}>
      <MjmlSection>
        <MjmlColumn>
          <Text fontWeight="bold">
            You&apos;ve got a new profile claim to review.
          </Text>
          <Text>From: {userEmail}</Text>
          <Text>
            <div
              style={{
                border: '1px solid #000',
                padding: '10px 20px 10px 10px',
                width: 'fit-content'
              }}
            >
              {resourceAvatar ? (
                <img
                  src={resourceAvatar}
                  alt={resourceName}
                  width={30}
                  height={30}
                  style={{
                    borderRadius: '30px',
                    verticalAlign: 'middle',
                    marginRight: '16px'
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    borderRadius: '30px',
                    backgroundColor: colors.sand,
                    marginRight: '16px',
                    verticalAlign: 'middle'
                  }}
                />
              )}
              {resourceName}
            </div>
          </Text>
        </MjmlColumn>
      </MjmlSection>
      <MjmlSection>
        <MjmlColumn>
          <Text>Look out for a message on Instagram.</Text>
          <Button
            href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/claims/index/record/claims/${claimId}/details?segmentId=1fb02ac5-5335-40f9-b613-ed6678639dc9`}
          >
            View Claim in Admin
          </Button>
        </MjmlColumn>
      </MjmlSection>
    </BaseLayout>
  )
}
NewClaim.subject = 'New claim for review'
