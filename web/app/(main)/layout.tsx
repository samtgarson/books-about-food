import { ReactNode } from 'react'
import { Footer } from 'src/components/nav/footer'
import { TopNav } from 'src/components/nav/top-nav'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
