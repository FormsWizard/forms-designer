import { useCallback, useState, useRef, useEffect } from 'react'

export function useDelayedState<T>(initial: T, { delay = 300, delayedValue = true }): [T ,React.Dispatch<React.SetStateAction<T>> , (state: T) => void] {
  const [state, setState] = useState(initial)
  const [change, setChange] = useState(initial)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    timer.current = setTimeout(function () {
      setState(change)
    }, delay)

    return function () {
      timer.current && clearTimeout(timer.current)
      timer.current = null
    }
  }, [change, delay, delayedValue])

  const cancel = useCallback((state: T) => {
    setState(state)
    timer.current && clearTimeout(timer.current)
    timer.current = null
  }, [])

  return [state, setChange, cancel]
}
