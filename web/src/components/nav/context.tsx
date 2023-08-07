'use client'
import { FC, ReactNode, createContext, useContext, useState } from 'react'

export type NavTheme = 'dark' | 'light'
type NavContext = {
  theme: NavTheme
  setTheme: (theme: NavTheme) => void
}

const NavContext = createContext({} as NavContext)

export const NavProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<NavTheme>('light')

  return (
    <NavContext.Provider value={{ theme, setTheme }}>
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
