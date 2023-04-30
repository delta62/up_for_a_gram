import { useRef } from 'react'
import { useResize, ResizeArgs } from '@hooks'

export let Grid = () => {
  let ref = useRef<HTMLCanvasElement>(null)
  useResize(({ width, height }: ResizeArgs) => {
    if (!ref.current) return

    ref.current.width = width
    ref.current.height = height
  })

  return <canvas ref={ref}></canvas>
}
