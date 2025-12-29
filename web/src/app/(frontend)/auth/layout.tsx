import { Metadata } from 'next'
import { ReactNode } from 'react'
import { Container } from 'src/components/atoms/container'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="grow py-20">
        <Container>{children}</Container>
      </main>
    </>
  )
}
