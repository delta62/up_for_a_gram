import { useEffect } from 'react'

export interface ResizeArgs {
  width: number
  height: number
}

export type ResizeCallback = (dimensions: ResizeArgs) => void

export let useResize = (cb: ResizeCallback) => {
  useEffect(() => {
    let onResize = () => {
      let height = window.innerHeight
      let width = window.innerWidth

      cb({ width, height })
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [cb])
}
