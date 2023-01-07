import { BookSeeder } from 'lib/book-seeder'
import { JobSeeder } from 'lib/job-seeder'
import { ProfileSeeder } from 'lib/profile-seeder'
import { PublisherSeeder } from 'lib/publisher-seeder'
import { TagSeeder } from 'lib/tag-seeder'
import ora from 'ora'

const jobSeeder = new JobSeeder()
const tagSeeder = new TagSeeder()
const publisherSeeder = new PublisherSeeder()
const profileSeeder = new ProfileSeeder()
const bookSeeder = new BookSeeder()

const perform = async () => {
  const jobs = jobSeeder.call()
  const publishers = publisherSeeder.call()
  const tags = tagSeeder.call()

  ora.promise(jobs, 'Seeding Jobs')
  ora.promise(publishers, 'Seeding Publishers')
  ora.promise(tags, 'Seeding Tags')
  await Promise.all([jobs, publishers, tags])

  const profiles = profileSeeder.call()
  ora.promise(profiles, 'Seeding Profiles')
  await profiles

  const books = bookSeeder.call()
  ora.promise(books, 'Seeding Books')

  await books
}

perform()
