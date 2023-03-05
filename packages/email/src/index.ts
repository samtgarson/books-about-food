import nodemailer from 'nodemailer'
import { buildSendMail } from 'mailing-core'

const transport = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendMail = buildSendMail({
  transport,
  defaultFrom: 'no-replay@booksaboutfood.info',
  configPath: './mailing.config.json'
})

export default sendMail
export { default as NewClaim } from './templates/new-claim'
