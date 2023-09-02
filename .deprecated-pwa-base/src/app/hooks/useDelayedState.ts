import { useCallback, useState, useRef, useEffect } from 'react'

export default function useDelkayedState(initial, { delay = 300, delayedValue = true }) {
  const [state, setState] = useState(initial)
  const [change, setChange] = useState(initial)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setTimeout(function () {
      setState(change)
    }, delay)

    return function () {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [change, delay, delayedValue])

  const cancel = useCallback((state) => {
    setState(state)
    clearTimeout(timer.current)
    timer.current = null
  }, [])

  return [state, setChange, cancel]
}
