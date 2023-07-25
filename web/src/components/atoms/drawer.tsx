'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { FC, ReactNode } from 'react'
import { Container } from './container'

export const Drawer: FC<{
  children: ReactNode | null
}> = ({ children }) => {
  const router = useRouter()

  return (
    <Dialog.Root
      open={!!children}
      onOpenChange={() => {
        router.back()
      }}
    >
      <Dialog.Overlay className="fixed inset-0 bg-white opacity-50 z-40" />
      <Dialog.Portal>
        <Dialog.Content asChild>
          <Container className="fixed inset-y-0 right-0 w-screen max-w-2xl bg-grey z-50">
            {children}
          </Container>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
