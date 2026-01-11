'use client'

import { Button, FullscreenModal, TextInput, useModal } from '@payloadcms/ui'
import cn from 'classnames'
import { ReactNode, useCallback, useId, useState } from 'react'
import {
  createMenuActions,
  getCurrentLink,
  type TiptapEditor
} from 'src/lib/editor'

const baseClass = 'confirmation-modal'

export function EditorLinkModal({
  editor,
  children
}: {
  editor: TiptapEditor
  children: ReactNode
}) {
  const { openModal, closeModal } = useModal()
  const modalSlug = useId()
  const [url, setUrl] = useState('')
  const actions = createMenuActions(editor)

  const handleOpen = useCallback(() => {
    const currentLink = getCurrentLink(editor)
    setUrl(currentLink)
    openModal(modalSlug)
  }, [editor, openModal, modalSlug])

  const handleSave = useCallback(() => {
    actions.setLink(url)
    closeModal(modalSlug)
  }, [actions, url, closeModal, modalSlug])

  const handleRemove = useCallback(() => {
    actions.unsetLink()
    closeModal(modalSlug)
  }, [actions, closeModal, modalSlug])

  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <FullscreenModal
        slug={modalSlug}
        className={cn('editor-link-modal', baseClass)}
      >
        <div className={`${baseClass}__wrapper`}>
          <div className={`${baseClass}__content`}>
            <h2>Edit Link</h2>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <TextInput
                path="link-url"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
                placeholder="https://example.com"
              />
            </div>
            <div className={`${baseClass}__controls`}>
              <Button onClick={handleSave} buttonStyle="primary">
                Save
              </Button>
              {getCurrentLink(editor) && (
                <Button onClick={handleRemove} buttonStyle="secondary">
                  Remove Link
                </Button>
              )}
              <Button
                onClick={() => closeModal(modalSlug)}
                buttonStyle="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </FullscreenModal>
    </>
  )
}
