'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { ExternalToast, toast } from 'sonner'
import { AlertTriangle, Check } from 'src/components/atoms/icons'

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
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get('action') !== action) return
    switch (type) {
      case 'success':
        successToast(message, data)
        break
      case 'error':
        errorToast(message, data)
        break
      default:
        toast(message, data)
    }
    router.replace(location.pathname, { scroll: false })
  }, [action, data, message, router, type, searchParams])

  return null
}

export const successToast = (message: string, data?: ExternalToast) => {
  toast(message, {
    ...data,
    icon: <Check size={24} strokeWidth={1} />
  })
}

export const errorToast = (message: string, data?: ExternalToast) => {
  toast(message, {
    ...data,
    icon: <AlertTriangle size={24} strokeWidth={1} />
  })
}
