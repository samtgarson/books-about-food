import prisma from 'database'

export const fetchTags = async () =>
  prisma.tag.findMany({ orderBy: { name: 'asc' } })
