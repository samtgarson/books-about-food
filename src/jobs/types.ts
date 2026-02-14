export type JobResult =
  | { id: string; status: 'success' }
  | { id: string; status: 'failed'; message: string }
  | { id: string; status: 'skipped'; message: string }
