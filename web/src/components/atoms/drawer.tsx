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
      <Dialog.Overlay className="fixed inset-0 z-40 bg-white opacity-50" />
      <Dialog.Portal>
        <Dialog.Content asChild>
          <Container className="bg-grey fixed inset-y-0 right-0 z-50 w-screen max-w-2xl">
            {children}
          </Container>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
