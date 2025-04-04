import { signOut } from './actions'

export const SignOutButton = () => {
  return (
    <form action={signOut}>
      <button className="w-full px-4 py-2.5 text-left transition-colors hover:bg-sand">
        Sign Out
      </button>
    </form>
  )
}
