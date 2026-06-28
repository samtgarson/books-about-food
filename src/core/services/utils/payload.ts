import { getPayload, Payload } from 'payload'

let payloadInstance: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (!payloadInstance) {
    // Lazy import avoids a circular dependency with payload.config.
    const { default: config } = await import('@payload-config')
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

export type { Payload }
