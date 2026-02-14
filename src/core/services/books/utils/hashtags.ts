import { Contribution } from '../../../models/contribution'
import { FullBook } from '../../../models/full-book'
import { Profile } from '../../../models/profile'

export function hashtags(book: FullBook) {
  let tags = book.title
  if (book.subtitle) tags += `: ${book.subtitle}`

  const authors = authorHandles(book.authors)
  if (authors.length) tags += ` by ${authors.join(' ')}`

  const extras = []
  const contribs = contribHandles(book.contributions)
  if (contribs.length) {
    extras.push(contribs.join(' • '))
  }

  if (book.publisher) {
    extras.push(`Publisher ${handle(book.publisher)}`)
  }

  if (extras.length) tags += `\n•\n${extras.join(' • ')}`
  return `${tags}
•
#food #recipes #bookstagram #bookcovers #design #books #cooking #cookbook #booksaboutfoodclub #foodstagram #cookbooks #booksaboutfood`
}

function authorHandles(profiles: Profile[]) {
  return profiles.map(handle)
}

function contribHandles(contribs: Contribution[]) {
  const jobs = contribs.reduce(
    (hsh, c) => {
      hsh[c.jobName] ||= []
      return {
        ...hsh,
        [c.jobName]: [...hsh[c.jobName], handle(c.profile)]
      }
    },
    {} as Record<string, string[]>
  )

  return Object.keys(jobs).map((job) => `${job} ${jobs[job].join(' ')}`)
}

function handle(profile: { name: string; instagram?: string }) {
  if (profile.instagram) return `@${profile.instagram}`
  return `#${profile.name.replace(/ +/g, '')}`
}
