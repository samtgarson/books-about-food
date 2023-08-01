import { redirect } from 'next/navigation'
import { getUser } from 'src/services/auth/get-user'
import { Service } from './service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callWithUser<Svc extends Service<any, any>>(
  svc: Svc,
  args: unknown
): Promise<ReturnType<Svc['call']>> {
  const user = await getUser.call()
  if (!user) redirect('/auth/sign-in')
  return svc.parseAndCall(args, user)
}
