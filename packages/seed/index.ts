import { BookSeeder } from 'lib/book-seeder'
import { JobSeeder } from 'lib/job-seeder'
import { ProfileSeeder } from 'lib/profile-seeder'
import { PublisherSeeder } from 'lib/publisher-seeder'
import ora from 'ora'

const jobSeeder = new JobSeeder()
const publisherSeeder = new PublisherSeeder()
const profileSeeder = new ProfileSeeder()
const bookSeeder = new BookSeeder()

const perform = async () => {
  const jobs = jobSeeder.call()
  const publishers = publisherSeeder.call()

  ora.promise(jobs, 'Seeding Jobs')
  ora.promise(publishers, 'Seeding Publishers')
  await Promise.all([jobs, publishers])

  const profiles = profileSeeder.call()
  ora.promise(profiles, 'Seeding Profiles')
  await profiles

  const books = bookSeeder.call()
  ora.promise(books, 'Seeding Books')

  await books
}

perform()
