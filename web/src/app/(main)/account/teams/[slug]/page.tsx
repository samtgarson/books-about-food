import { fetchTeam } from '@books-about-food/core/services/teams/fetch-team'
import { notFound } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { PageProps } from 'src/components/types'
import { Toaster } from 'src/components/utils/toaster'
import { call } from 'src/utils/service'

export default async function TeamPage({
  params: { slug }
}: PageProps<{ slug: string }>) {
  const { data: team } = await call(fetchTeam, { slug })
  if (!team) notFound()

  return (
    <div className="flex flex-col gap-8">
      <Toaster
        action="invite-accepted"
        type="success"
        message="Invite accepted"
      />
      <AccountHeader title={team.name} />
    </div>
  )
}
