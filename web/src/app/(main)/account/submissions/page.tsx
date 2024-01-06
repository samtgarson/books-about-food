import { Metadata } from 'next'
import { Suspense } from 'react'
import { AccountHeader } from 'src/components/accounts/header'
import { SubmissionsList } from 'src/components/accounts/submissions-list'
import { Loader } from 'src/components/atoms/loader'
import { PageProps } from 'src/components/types'
import { Toaster } from 'src/components/utils/toaster'

export const metadata: Metadata = {
  title: 'Submissions'
}

const Page = async ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col gap-8">
      <Toaster action="deleted" message="Cookbook deleted" type="success" />
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
