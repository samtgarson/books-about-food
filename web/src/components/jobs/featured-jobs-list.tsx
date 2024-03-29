import { fetchFeaturedJobs } from '@books-about-food/core/services/home/fetch-jobs'
import { pluralize } from 'inflection'
import Link from 'next/link'
import { call } from 'src/utils/service'

export async function FeaturedJobsList() {
  const { data: jobs = [] } = await call(fetchFeaturedJobs)

  return (
    <ul className="flex flex-wrap gap-2 md:gap-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link
            className="border-khaki text-20 md:text-32 flex gap-2 rounded-full border px-4 py-2 transition-colors hover:border-white hover:bg-white md:px-6 md:py-3"
            href={`/people?jobs=${job.id}`}
          >
            <p className="opacity-45">{job.count}</p>
            <p>{job.count === '1' ? job.name : pluralize(job.name)}</p>
          </Link>
        </li>
      ))}
      <li key="all">
        <Link
          className="text-20 md:text-32 flex gap-2 rounded-full border border-black bg-black px-4 py-2 text-white transition-colors md:px-6 md:py-3"
          href={`/people`}
        >
          <p>View All</p>
        </Link>
      </li>
    </ul>
  )
}
