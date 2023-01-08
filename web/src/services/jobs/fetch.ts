import prisma from 'database'

export const fetchJobs = async () =>
  prisma.job.findMany({ orderBy: { name: 'asc' } })
