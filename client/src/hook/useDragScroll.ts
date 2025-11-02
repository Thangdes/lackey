import { useRef, useState } from 'react'

export type DragBindings = {
  isDragging: boolean
  isDraggingMouse: boolean
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUpOrLeave: () => void
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerUpOrCancel: (e: React.PointerEvent<HTMLDivElement>) => void
}

export function useDragScroll(
  scrollerRef: React.RefObject<HTMLDivElement | null>,
  updateArrowState: () => void,
  stopWheelAnimation?: () => void
): DragBindings {
  const dragRef = useRef<{ isDragging: boolean; startX: number; startScrollLeft: number }>({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
  })
  const [isDraggingMouse, setIsDraggingMouse] = useState(false)

  const dragKinematicsRef = useRef<{ lastX: number; lastT: number; velocity: number }>({
    lastX: 0,
    lastT: 0,
    velocity: 0,
  })
  const dragAnimRef = useRef<{ rafId: number | null }>({ rafId: null })

  const stopDragAnimation = (): void => {
    if (dragAnimRef.current.rafId != null) {
      cancelAnimationFrame(dragAnimRef.current.rafId)
      dragAnimRef.current.rafId = null
    }
  }

  const stepDragInertia = (): void => {
    const el = scrollerRef.current
    if (!el) {
      stopDragAnimation()
      return
    }

    const FRICTION = 0.92
    const MAX_VELOCITY = 60
    const EPSILON = 0.2

    dragKinematicsRef.current.velocity *= FRICTION
    if (dragKinematicsRef.current.velocity > MAX_VELOCITY) dragKinematicsRef.current.velocity = MAX_VELOCITY
    if (dragKinematicsRef.current.velocity < -MAX_VELOCITY) dragKinematicsRef.current.velocity = -MAX_VELOCITY

    if (Math.abs(dragKinematicsRef.current.velocity) < EPSILON) {
      stopDragAnimation()
      updateArrowState()
      return
    }

    const maxScrollLeft = el.scrollWidth - el.clientWidth
    const nextScrollLeft = Math.min(Math.max(0, el.scrollLeft + dragKinematicsRef.current.velocity), Math.max(0, maxScrollLeft))
    const actualDelta = nextScrollLeft - el.scrollLeft
    el.scrollLeft = nextScrollLeft
    if (actualDelta === 0) {
      dragKinematicsRef.current.velocity *= 0.5
    }

    updateArrowState()
    dragAnimRef.current.rafId = requestAnimationFrame(stepDragInertia)
  }

  const startDragInertia = (): void => {
    if (Math.abs(dragKinematicsRef.current.velocity) <= 0.01) return
    if (dragAnimRef.current.rafId == null) {
      dragAnimRef.current.rafId = requestAnimationFrame(stepDragInertia)
    }
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    const el = scrollerRef.current
    if (!el) return
    if (e.button !== 0) return
    stopWheelAnimation?.()
    stopDragAnimation()
    dragRef.current.isDragging = true
    dragRef.current.startX = e.clientX
    dragRef.current.startScrollLeft = el.scrollLeft
    setIsDraggingMouse(true)
    dragKinematicsRef.current.lastX = e.clientX
    dragKinematicsRef.current.lastT = performance.now()
    dragKinematicsRef.current.velocity = 0
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const el = scrollerRef.current
    if (!el) return
    if (!dragRef.current.isDragging) return
    e.preventDefault()
    const x = e.clientX
    const walk = x - dragRef.current.startX
    el.scrollLeft = dragRef.current.startScrollLeft - walk
    updateArrowState()

    const now = performance.now()
    const dx = x - dragKinematicsRef.current.lastX
    const dt = now - dragKinematicsRef.current.lastT
    if (dt > 0) {
      const SPEED_MULTIPLIER = 1.1
      const vPxPerFrame = (dx / dt) * 16 * SPEED_MULTIPLIER
      dragKinematicsRef.current.velocity = -vPxPerFrame
      dragKinematicsRef.current.lastX = x
      dragKinematicsRef.current.lastT = now
    }
  }

  const onMouseUpOrLeave = (): void => {
    if (!dragRef.current.isDragging) return
    dragRef.current.isDragging = false
    setIsDraggingMouse(false)
    startDragInertia()
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    const el = scrollerRef.current
    if (!el) return
    if (!e.isPrimary || e.button !== 0) return
    stopWheelAnimation?.()
    stopDragAnimation()
    dragRef.current.isDragging = true
    dragRef.current.startX = e.clientX
    dragRef.current.startScrollLeft = el.scrollLeft
    try { el.setPointerCapture(e.pointerId) } catch {}
    setIsDraggingMouse(true)
    dragKinematicsRef.current.lastX = e.clientX
    dragKinematicsRef.current.lastT = performance.now()
    dragKinematicsRef.current.velocity = 0
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    const el = scrollerRef.current
    if (!el) return
    if (!dragRef.current.isDragging) return
    e.preventDefault()
    const x = e.clientX
    const walk = x - dragRef.current.startX
    el.scrollLeft = dragRef.current.startScrollLeft - walk
    updateArrowState()

    const now = performance.now()
    const dx = x - dragKinematicsRef.current.lastX
    const dt = now - dragKinematicsRef.current.lastT
    if (dt > 0) {
      const SPEED_MULTIPLIER = 1.1
      const vPxPerFrame = (dx / dt) * 16 * SPEED_MULTIPLIER
      dragKinematicsRef.current.velocity = -vPxPerFrame
      dragKinematicsRef.current.lastX = x
      dragKinematicsRef.current.lastT = now
    }
  }

  const onPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>): void => {
    const el = scrollerRef.current
    if (el) {
      try { el.releasePointerCapture(e.pointerId) } catch {}
    }
    if (!dragRef.current.isDragging) return
    dragRef.current.isDragging = false
    setIsDraggingMouse(false)
    startDragInertia()
  }

  return {
    isDragging: dragRef.current.isDragging,
    isDraggingMouse,
    onMouseDown,
    onMouseUpOrLeave,
    onMouseMove,
    onPointerDown,
    onPointerMove,
    onPointerUpOrCancel,
  }
}
