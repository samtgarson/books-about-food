import { NextApiHandler } from 'next'
import { z } from 'zod'
import { fetchBook } from 'src/services/books/fetch-book'
import { fetchBooks } from 'src/services/books/fetch-books'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import superjson from 'superjson'
import 'src/utils/superjson'
import { fetchTags } from 'src/services/tags/fetch'
import { fetchJobs } from 'src/services/jobs/fetch-jobs'

export const functionMap = {
  books: fetchBooks,
  book: fetchBook,
  profiles: fetchProfiles,
  publishers: fetchPublishers,
  tags: fetchTags,
  jobs: fetchJobs
} as const

export type FunctionMap = typeof functionMap
export type FunctionKey = keyof FunctionMap
type FunctionInputs = {
  [key in FunctionKey]: z.infer<FunctionMap[key]['input']>
}
export type FunctionArgs<K extends FunctionKey> = FunctionInputs[K]
export type FunctionReturn<K extends FunctionKey> = Awaited<
  ReturnType<FunctionMap[K]['call']>
>

const handler: NextApiHandler = async (req, res) => {
  const { fn, input } = req.query as { fn: FunctionKey; input?: string }
  const service = functionMap[fn as FunctionKey]

  if (!service) {
    res.status(404).end()
    return
  }

  try {
    const parsed = input && superjson.parse(input)
    const data = await service.parseAndCall(parsed)
    const serialized = superjson.serialize(data)
    res.status(200).json(serialized)
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}

export default handler
