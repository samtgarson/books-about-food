'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'
import { ActionButton } from '../../../components/actions/action-button'
import { featureProfile, unfeatureProfile } from '../actions'

export function ProfileFeatureButton() {
  const { id } = useDocumentInfo()
  const [isFeatured, setIsFeatured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if profile is already featured
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function checkFeatured() {
      try {
        const response = await fetch(
          `/api/featured-profiles?where[profile][equals]=${id}&limit=1`
        )
        const data = await response.json()
        setIsFeatured(data.docs?.length > 0)
      } catch {
        setIsFeatured(false)
      } finally {
        setLoading(false)
      }
    }

    checkFeatured()
  }, [id])

  const handleFeature = useCallback(async () => {
    if (!id) return { success: false, error: 'No profile ID' }
    const result = await featureProfile(String(id))
    if (result.success) setIsFeatured(true)
    return result
  }, [id])

  const handleUnfeature = useCallback(async () => {
    if (!id) return { success: false, error: 'No profile ID' }
    const result = await unfeatureProfile(String(id))
    if (result.success) setIsFeatured(false)
    return result
  }, [id])

  if (!id || loading) {
    return null
  }

  if (isFeatured) {
    return (
      <ActionButton
        action={handleUnfeature}
        label="Unfeature"
        confirmTitle="Remove from Homepage"
        confirmMessage="This profile will no longer be featured."
        successMessage="Profile removed from homepage"
        variant="secondary"
      />
    )
  }

  return (
    <ActionButton
      action={handleFeature}
      label="Feature"
      confirmTitle="Feature on Homepage"
      confirmMessage="This profile will be featured on the homepage."
      successMessage="Profile featured on homepage"
      variant="primary"
    />
  )
}
