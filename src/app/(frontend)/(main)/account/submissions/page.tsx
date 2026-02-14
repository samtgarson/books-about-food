import { Suspense } from 'react'
import { AccountHeader } from 'src/components/accounts/header'
import { SubmissionsList } from 'src/components/accounts/submissions-list'
import { Loader } from 'src/components/atoms/loader'
import { Toaster } from 'src/components/utils/toaster'
import { genMetadata } from 'src/utils/metadata'

export const metadata = genMetadata('/account/submissions', null, {
  title: 'Your Submissions',
  description: 'Submit a cookbook to the wider community'
})

export default async function Page(props: PageProps<'/account/submissions'>) {
  const searchParams = await props.searchParams
  return (
    <div className="flex flex-col gap-8">
      <Toaster action="deleted" message="Cookbook deleted" type="success" />
      <AccountHeader title="Your Submissions" />
      <p>
        When submitting, please fill as much information as you can. We hope the
        wider community would then help complete any missing information.
      </p>
      <Suspense fallback={<Loader />}>
        <SubmissionsList page={Number(searchParams.page ?? 0)} />
      </Suspense>
    </div>
  )
}
