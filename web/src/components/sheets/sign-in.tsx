import { usePathname } from 'next/navigation'
import * as Sheet from 'src/components/atoms/sheet'
import { SignInButtons } from '../auth/sign-in-buttons'
import { SheetComponent } from './types'

export type SignInSheetProps =
  | {
      redirect?: string | null | false
    }
  | undefined

export const SignInSheet: SheetComponent<SignInSheetProps> = ({
  redirect = '/account'
} = {}) => {
  const currentPath = usePathname()
  const callbackUrl = redirect || currentPath || undefined

  return (
    <Sheet.Content>
      <Sheet.Body title="Login or create an account">
        <SignInButtons callbackUrl={callbackUrl} />
      </Sheet.Body>
    </Sheet.Content>
  )
}

SignInSheet.grey = true
