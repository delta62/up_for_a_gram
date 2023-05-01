import { useCallback, useEffect } from 'react'

export interface ResizeArgs {
  width: number
  height: number
}

export type ResizeCallback = (dimensions: ResizeArgs) => void

export let useResize = (cb: ResizeCallback) => {
  let onResize = useCallback(() => {
    let height = window.innerHeight
    let width = window.innerWidth

    cb({ width, height })
  }, [cb])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()

    return () => window.removeEventListener('resize', onResize)
  }, [cb])
}
