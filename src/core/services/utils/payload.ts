import { getPayload, Payload } from 'payload'

let payloadInstance: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (!payloadInstance) {
    // Imported lazily: `@payload-config` is `payload.config.ts`, which pulls in
    // this module transitively (collections → jobs → middleware → here). A
    // top-level import creates a circular dependency that throws a TDZ error
    // when the config is evaluated via tsx (e.g. `payload migrate`).
    const { default: config } = await import('@payload-config')
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

export type { Payload }
