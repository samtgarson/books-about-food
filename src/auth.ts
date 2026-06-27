import { getPayloadAuth } from 'payload-auth/better-auth/plugin'
import payloadConfig from 'src/payload.config'

const payload = await getPayloadAuth(payloadConfig)

export const auth = payload.betterAuth
