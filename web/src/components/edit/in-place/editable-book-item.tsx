'use client'

import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { ReactNode, useState } from 'react'
import { Eye, EyeOff } from 'src/components/atoms/icons'
import { Loader } from 'src/components/atoms/loader'
import { Container, Cover, Footer } from 'src/components/books/item'
import { useListDisplay } from 'src/components/lists/list-context'

type EditableBookItemProps = {
  book: Book
  editMode: boolean
  hidden: boolean
  children?: ReactNode
  updateVisibility: (newValue: boolean) => Promise<void>
}
export function EditableBookItem({
  book,
  editMode,
  hidden: initialHidden,
  children,
  updateVisibility
}: EditableBookItemProps) {
  const [hidden, setHidden] = useState<boolean>(initialHidden)
  const { display } = useListDisplay()

  if (hidden && !editMode) return null
  return (
    <Container book={book} link={!editMode}>
      <Cover
        book={book}
        className={cn(
          editMode && (hidden ? 'opacity-30 saturate-0' : 'opacity-80')
        )}
        mobileColorful={!editMode}
      />
      {display === 'list' && (
        <Footer
          className={cn(
            'transition',
            editMode ? (hidden ? 'opacity-30' : 'opacity-80') : ''
          )}
        >
          <p className="mb-1 text-16 font-medium">{book.title}</p>
          <p className="text-14">{book.authorNames}</p>
        </Footer>
      )}
      {editMode && (
        <div className="pointer-events-auto z-20 ml-auto flex items-center justify-center gap-2 sm:absolute sm:inset-0 sm:ml-0 sm:aspect-square">
          <EditableBookAction
            title={hidden ? `Show ${book.title}` : `Hide ${book.title}`}
            onClick={async () => {
              await updateVisibility(!hidden)
              setHidden(!hidden)
            }}
          >
            {hidden ? <EyeOff strokeWidth={1} /> : <Eye strokeWidth={1} />}
          </EditableBookAction>
          {children}
        </div>
      )}
    </Container>
  )
}

type EditableBookActionProps = {
  children: ReactNode
  title: string
  onClick: () => Promise<void>
}
export function EditableBookAction({
  children,
  title,
  onClick
}: EditableBookActionProps) {
  const [loading, setLoading] = useState(false)
  return (
    <button
      className="flex h-10 w-10 items-center justify-center bg-white"
      title={title}
      onClick={async function () {
        setLoading(true)
        await onClick()
        setLoading(false)
      }}
    >
      {loading ? <Loader /> : children}
    </button>
  )
}
