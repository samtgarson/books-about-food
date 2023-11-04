'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ExternalToast, toast } from 'sonner'

export function Toaster({
  action,
  message,
  data,
  type = 'message'
}: {
  action: string
  message: string
  data?: ExternalToast
  type?: 'message' | 'success' | 'error'
}) {
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('action') === action) {
      toast[type](message, data)
      router.replace(location.pathname)
    }
  }, [action, data, message, router, type])

  return null
}
