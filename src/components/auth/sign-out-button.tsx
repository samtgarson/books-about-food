'use client'

import { authClient } from 'src/lib/auth/client'

export const SignOutButton = () => {
  return (
    <button
      className="w-full px-4 py-2.5 text-left transition-colors hover:bg-sand"
      onClick={async function () {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = '/'
            }
          }
        })
      }}
    >
      Sign Out
    </button>
  )
}
