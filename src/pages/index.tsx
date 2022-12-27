import { useSession } from 'next-auth/react'

export default function Page() {
  const session = useSession()
  console.log(session)
  return <h1>Home</h1>
}
