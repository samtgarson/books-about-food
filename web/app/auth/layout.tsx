import { ReactNode } from 'react'
import { Container } from 'src/components/atoms/container'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-grow py-20">
        <Container>{children}</Container>
      </main>
    </>
  )
}
