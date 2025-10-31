import { useEffect, useState } from 'react'


export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const maxWidth = Number(process.env.NEXT_PUBLIC_MOBILE_MAX_WIDTH || 1024)
    const mq: MediaQueryList = window.matchMedia(`(max-width: ${maxWidth - 1}px)`) // strictly below maxWidth
    const handler = (ev: MediaQueryListEvent | MediaQueryList) => {
      const matches = (ev as MediaQueryListEvent).matches ?? (ev as MediaQueryList).matches
      setIsMobile(!!matches)
    }
    // init
    handler(mq)
    // subscribe
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler as (e: MediaQueryListEvent) => void)
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(handler as (this: MediaQueryList, ev: MediaQueryListEvent) => void)
    }
    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', handler as (e: MediaQueryListEvent) => void)
      } else if (typeof mq.removeListener === 'function') {
        mq.removeListener(handler as (this: MediaQueryList, ev: MediaQueryListEvent) => void)
      }
    }
  }, [])

  return isMobile
}
