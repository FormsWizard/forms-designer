import { useEffect, useState, useRef, RefObject } from 'react'

const BOUND_HEIGHT_BOT = 250
const BOUND_HEIGHT_TOP = 180

function getScrollDirection({
  position,
  upperBounds = Infinity,
  lowerBounds = -Infinity,
}: {
  position: number | undefined
  upperBounds: number
  lowerBounds: number
}): number {
  if (position === undefined) {
    return 0
  }
  if (position > lowerBounds - BOUND_HEIGHT_BOT) {
    return 1 - (lowerBounds - position) / BOUND_HEIGHT_BOT
  }
  if (position < upperBounds + BOUND_HEIGHT_TOP) {
    return (1 - (upperBounds + position) / BOUND_HEIGHT_TOP) * -1
  }
  return 0
}

export const useScroll = () => {
  const [position, setPosition] = useState<number>(window.innerHeight / 2)

  const scrollTimer = useRef<null | number>(null)

  const scrollSpeed = 5

  const direction = getScrollDirection({
    position,
    upperBounds: 0,
    lowerBounds: window.innerHeight,
  })

  useEffect(() => {
    if (direction !== 0) {
      scrollTimer.current = setInterval(() => {
        window.scrollBy(0, scrollSpeed * direction)
      }, 1)
    }
    return () => {
      if (scrollTimer.current) {
        clearInterval(scrollTimer.current)
      }
    }
  }, [direction, scrollSpeed])

  return { updatePosition: setPosition } as const
}
