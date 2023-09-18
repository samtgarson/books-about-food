import Link from 'next/link'
import { fetchFeaturedJobs } from 'src/services/home/fetch-jobs'
import { pluralize } from 'inflection'

export async function FeaturedJobsList() {
  const jobs = await fetchFeaturedJobs.call()

  return (
    <ul className="flex flex-wrap gap-2 md:gap-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link
            className="flex gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 border border-khaki text-20 md:text-32 transition-colors hover:bg-white hover:border-white"
            href={`/people?jobs=${job.id}`}
          >
            <p className="opacity-40">{job.count}</p>
            <p>{job.count === '1' ? job.name : pluralize(job.name)}</p>
          </Link>
        </li>
      ))}
      <li key="all">
        <Link
          className="flex gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 border border-black text-20 md:text-32 transition-colors bg-black text-white"
          href={`/people`}
        >
          <p>View All</p>
        </Link>
      </li>
    </ul>
  )
}
