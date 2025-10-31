"use client"
import React, { memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ArrowSide = 'left' | 'right'

export type ArrowButtonProps = {
  side: ArrowSide
  visible: boolean
  disabled: boolean
  waiting: boolean
  onClick: () => void
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ side, visible, disabled, waiting, onClick }) => {
  const isLeft = side === 'left'
  const gradientClass = isLeft
    ? 'absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-0'
    : 'absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-0'

  return (
    <div className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 z-20 flex items-center pointer-events-none ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className={`${gradientClass} ${visible ? 'block' : 'hidden'}`}></div>
      <button
        onClick={onClick}
        className={`relative z-10 p-1.5 rounded-full transition-all duration-200 hover:bg-neutral-100 pointer-events-auto ${
          waiting ? 'cursor-wait' : 'cursor-pointer'
        }`}
        aria-label={`Scroll categories ${side}`}
        disabled={disabled}
      >
        {isLeft ? (
          <ChevronLeft className="w-5 h-5 text-black" />
        ) : (
          <ChevronRight className="w-5 h-5 text-black" />
        )}
      </button>
    </div>
  )
}
ArrowButton.displayName = 'ArrowButton'

export default memo(ArrowButton)
