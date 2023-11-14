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
}

export const NewClaim: Template<NewClaimProps> = ({
  claimId,
  resourceName,
  resourceAvatar,
  recipientName
}) => {
  return (
    <BaseLayout recipientName={recipientName}>
      <MjmlSection>
        <MjmlColumn>
          <Text>
            <b>There is a new Profile claim for your review!</b>
          </Text>
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
                  width={60}
                  height={60}
                  style={{
                    borderRadius: '60px',
                    verticalAlign: 'middle',
                    marginRight: '16px'
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'inline-block',
                    width: '60px',
                    height: '60px',
                    borderRadius: '60px',
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
