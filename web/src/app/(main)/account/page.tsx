import { fetchAccounts } from '@books-about-food/core/services/auth/get-accounts'
import { fetchProfile } from '@books-about-food/core/services/profiles/fetch-profile'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { ArrowUpRight } from 'react-feather'
import { AccountForm } from 'src/components/accounts/account-form'
import { ContactLink } from 'src/components/atoms/contact-link'
import { ProfileItem } from 'src/components/profiles/item'
import { call, getUser } from 'src/utils/service'

export const metadata: Metadata = {
  title: 'Account'
}

const Page = async () => {
  const [user, { data: accounts = [] }] = await Promise.all([
    getUser(),
    call(fetchAccounts)
  ])

  if (!user) return null

  return (
    <div className="flex flex-col gap-16">
      <AccountForm user={user} accounts={accounts ?? []} />
      <Suspense>
        <ProfileSection userId={user.id} />
      </Suspense>
      <div>
        <h3 className="text-20 mb-4">Delete your account</h3>
        <p>
          If you would like to delete your account, please{' '}
          <ContactLink subject="I'd like to delete my BAF account">
            get in touch
          </ContactLink>
          .
        </p>
      </div>
    </div>
  )
}

async function ProfileSection({ userId }: { userId: string }) {
  const { data: profile } = await call(fetchProfile, { userId })
  if (!profile) return null

  return (
    <div>
      <h3 className="text-20 mb-4">Your Public Profile</h3>
      <div className="relative">
        <ProfileItem profile={profile} display="list" />
        <ArrowUpRight
          strokeWidth={1}
          size={24}
          className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  )
}

export default Page
