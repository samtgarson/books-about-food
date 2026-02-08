'use server'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import { redirect } from 'next/navigation'

const password = getEnv('POSTMARK_SERVER_TOKEN')

export async function checkEmail(messageId: string) {
  const res = await fetch(
    `https://api.postmarkapp.com/messages/outbound/${messageId}/details`,
    {
      headers: {
        accept: 'application/json',
        'X-Postmark-Server-Token': password
      }
    }
  )

  if (res.status === 200) {
    return redirect(
      `https://account.postmarkapp.com/servers/14846385/streams/outbound/messages/${messageId}`
    )
  }

  console.log('Error fetching email details:', res.status, await res.text())
  return res.status
}
