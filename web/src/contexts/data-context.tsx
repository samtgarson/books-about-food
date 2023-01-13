'use client'

import { useContext, createContext } from 'react'

type DataContext = {
  tags: string[]
}

const DataContext = createContext({} as DataContext)

export const useData = () => useContext(DataContext)

export const DataProvider = ({
  children,
  ...data
}: { children: React.ReactNode } & DataContext) => (
  <DataContext.Provider value={data}>{children}</DataContext.Provider>
)
