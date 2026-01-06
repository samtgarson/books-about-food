'use client'

import { signOut } from 'next-auth/react'

export const SignOutButton = () => {
  return (
    <button
      className="w-full px-4 py-2.5 text-left transition-colors hover:bg-sand"
      onClick={async function () {
        await signOut({ redirectTo: '/', redirect: true })
      }}
    >
      Sign Out
    </button>
  )
}
