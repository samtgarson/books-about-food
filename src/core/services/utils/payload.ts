import config from '@payload-config'
import { getPayload, Payload } from 'payload'

export async function getPayloadClient(): Promise<Payload> {
  return getPayload({ config })
}

export type { Payload }
