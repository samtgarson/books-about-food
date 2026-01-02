import prisma from '@books-about-food/database'
import z from 'zod'
import { Service } from '../base'

export const fetchLocationFilterOption = new Service(
  z.object({ id: z.string() }),
  async function ({ id }, _ctx) {
    return await prisma.locationFilterOption.findUnique({
      where: { id }
    })
  }
)
