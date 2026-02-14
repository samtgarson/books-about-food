import config from '@payload-config'
import { getPayload, Payload } from 'payload'

let payloadInstance: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

export type { Payload }
