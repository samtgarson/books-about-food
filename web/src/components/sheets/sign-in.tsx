import { usePathname } from 'next/navigation'
import { FC } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { SignInButtons } from '../auth/sign-in-buttons'

export type SignInSheetProps =
  | {
    redirect?: string | null | false
  }
  | undefined

export const SignInSheet: FC<SignInSheetProps> = ({
  redirect = '/account'
} = {}) => {
  const currentPath = usePathname()
  const callbackUrl = redirect || currentPath || undefined

  return (
    <Sheet.Content>
      <Sheet.Body grey>
        <SignInButtons callbackUrl={callbackUrl} />
      </Sheet.Body>
    </Sheet.Content>
  )
}
