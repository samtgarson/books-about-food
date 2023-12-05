import { Metadata } from 'next'
import { Suspense } from 'react'
import { AccountHeader } from 'src/components/accounts/header'
import { SubmissionsList } from 'src/components/accounts/submissions-list'
import { Loader } from 'src/components/atoms/loader'
import { PageProps } from 'src/components/types'

export const metadata: Metadata = {
  title: 'Submissions'
}

export * from 'app/default-static-config'

const Page = async ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col gap-8">
      <AccountHeader title="Your Submissions">
        When submitting, please fill as much information as you can. We hope the
        wider community would then help complete any missing information.
      </AccountHeader>
      <Suspense fallback={<Loader />}>
        <SubmissionsList page={Number(searchParams.page ?? 0)} />
      </Suspense>
    </div>
  )
}

export default Page
