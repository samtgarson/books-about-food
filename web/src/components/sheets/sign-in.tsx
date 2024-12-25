import { usePathname } from 'next/navigation'
import * as Sheet from 'src/components/atoms/sheet'
import { SignInButtons } from '../auth/sign-in-buttons'
import { LogoShape } from '../icons/logo-shape'
import { SheetComponent } from './types'

export type SignInSheetProps =
  | {
      redirect?: string | null | false
      title?: string
      description?: string | null
    }
  | undefined

const SignInSheet: SheetComponent<SignInSheetProps> = ({
  redirect = '/account',
  title = 'Login or create an account',
  description = null
} = {}) => {
  const currentPath = usePathname()
  const callbackUrl = redirect || currentPath || undefined

  return (
    <Sheet.Content type="drawer" hideTitle>
      <LogoShape text className="w-16 h-auto" />
      <Sheet.Title>{title}</Sheet.Title>
      <Sheet.Body className="justify-center">
        {description && <p className="mb-8">{description}</p>}
        <SignInButtons callbackUrl={callbackUrl} />
      </Sheet.Body>
    </Sheet.Content>
  )
}

export default SignInSheet
