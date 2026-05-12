import { useCallback } from 'react'
import { toast } from 'sonner'
import { errorNormalizers, normalizeErrorForUser } from '@/utils/error-normalizer'

/**
 * Hook để xử lý lỗi một cách thân thiện với người dùng
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, context?: keyof typeof errorNormalizers) => {
    let message: string

    if (context && context in errorNormalizers) {
      message = errorNormalizers[context as keyof typeof errorNormalizers](error)
    } else {
      message = normalizeErrorForUser(error)
    }

    toast.error(message)
    return message
  }, [])

  const handleAuthError = useCallback((error: unknown) => {
    const message = errorNormalizers.auth(error)
    toast.error(message)
    return message
  }, [])

  const handleSignupError = useCallback((error: unknown) => {
    const message = errorNormalizers.signup(error)
    toast.error(message)
    return message
  }, [])

  const handleLoginError = useCallback((error: unknown) => {
    const message = errorNormalizers.login(error)
    toast.error(message)
    return message
  }, [])

  const handleCartError = useCallback((error: unknown) => {
    const message = errorNormalizers.cart(error)
    toast.error(message)
    return message
  }, [])

  const handleCheckoutError = useCallback((error: unknown) => {
    const message = errorNormalizers.checkout(error)
    toast.error(message)
    return message
  }, [])

  const handleOrderError = useCallback((error: unknown) => {
    const message = errorNormalizers.order(error)
    toast.error(message)
    return message
  }, [])

  const handlePaymentError = useCallback((error: unknown) => {
    const message = errorNormalizers.payment(error)
    toast.error(message)
    return message
  }, [])

  const handleShippingError = useCallback((error: unknown) => {
    const message = errorNormalizers.shipping(error)
    toast.error(message)
    return message
  }, [])

  return {
    handleError,
    handleAuthError,
    handleSignupError,
    handleLoginError,
    handleCartError,
    handleCheckoutError,
    handleOrderError,
    handlePaymentError,
    handleShippingError,
  }
}
