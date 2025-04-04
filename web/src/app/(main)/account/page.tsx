import { fetchAccounts } from '@books-about-food/core/services/auth/get-accounts'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { Suspense } from 'react'
import { AccountForm } from 'src/components/accounts/account-form'
import { AccountHeader } from 'src/components/accounts/header'
import { ContactLink } from 'src/components/atoms/contact-link'
import { ArrowUpRight } from 'src/components/atoms/icons'
import { InviteWidget } from 'src/components/memberships/invite-widget'
import { ProfileItem } from 'src/components/profiles/item'
import { genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'
import { getUser } from 'src/utils/user'

export const metadata = genMetadata('/account', null, {
  title: 'Account',
  description: 'Manage your account settings and profile.'
})

const Page = async () => {
  const [user, { data: accounts = [] }] = await Promise.all([
    getUser(),
    call(fetchAccounts)
  ])

  if (!user) return null

  return (
    <>
      <Suspense>
        <InviteWidget />
      </Suspense>
      <AccountForm user={user} accounts={accounts ?? []} />
      <Suspense>
        <ProfileSection userId={user.id} />
      </Suspense>
      <div className="flex flex-col gap-8">
        <AccountHeader title="Delete your account" />
        <p>
          If you would like to delete your account, please{' '}
          <ContactLink subject="I'd like to delete my BAF account">
            get in touch
          </ContactLink>
          .
        </p>
      </div>
    </>
  )
}

async function ProfileSection({ userId }: { userId: string }) {
  const { data } = await call(fetchProfiles, { userId })
  const { profiles } = data ?? {}
  if (!profiles?.length) return null

  return (
    <div className="flex flex-col gap-8">
      <AccountHeader title="Your Claimed Profiles" />
      <div className="relative max-w-xl">
        {profiles.map((profile) => (
          <ProfileItem key={profile.id} profile={profile} display="list" />
        ))}
        <ArrowUpRight
          strokeWidth={1}
          size={24}
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  )
}

export default Page
