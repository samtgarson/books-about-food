import { Service } from 'src/utils/service'
import { z } from 'zod'

export const getUser = new Service(z.undefined(), async (_, user) => user)
