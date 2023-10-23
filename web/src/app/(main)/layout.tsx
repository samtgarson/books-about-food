import { ReactNode, Suspense } from 'react'
import { NavProvider } from 'src/components/nav/context'
import { Footer } from 'src/components/nav/footer'
import { TopNav } from 'src/components/nav/top-nav'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <Suspense fallback={null}>
        <TopNav />
      </Suspense>
      <main className="flex flex-grow flex-col justify-start">{children}</main>
      <Footer />
    </NavProvider>
  )
}
