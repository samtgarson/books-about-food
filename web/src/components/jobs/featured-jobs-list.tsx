import { pluralize } from 'inflection'
import Link from 'next/link'
import { fetchFeaturedJobs } from 'src/core/services/home/fetch-jobs'
import { call } from 'src/utils/service'

export async function FeaturedJobsList() {
  const { data: jobs = [] } = await call(fetchFeaturedJobs)

  return (
    <ul className="flex flex-wrap gap-2 md:gap-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link
            className="flex gap-2 rounded-full border border-white bg-white px-4 py-2 text-20 transition-colors hover:border-khaki hover:bg-transparent md:px-6 md:py-3 md:text-32"
            href={`/people?jobs=${job.id}`}
          >
            <p className="opacity-50">{job.count}</p>
            <p>{job.count === '1' ? job.name : pluralize(job.name)}</p>
          </Link>
        </li>
      ))}
      <li key="all">
        <Link
          className="flex gap-2 rounded-full border border-black bg-black px-4 py-2 text-20 text-white transition-colors md:px-6 md:py-3 md:text-32"
          href="/people"
        >
          <p>View All</p>
        </Link>
      </li>
    </ul>
  )
}
