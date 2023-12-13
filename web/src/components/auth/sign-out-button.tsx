import { signOut } from './actions'

export const SignOutButton = () => {
  return (
    <form action={signOut}>
      <button className="hover:bg-sand w-full px-4 py-2.5 text-left transition-colors">
        Sign Out
      </button>
    </form>
  )
}
