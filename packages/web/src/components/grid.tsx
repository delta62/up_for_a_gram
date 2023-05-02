import { useEffect, useRef } from 'react'
import { useResize } from '@hooks'
import { useSelector } from 'react-redux'
import { GridState, RenderCellFlags, getGridState } from 'store'

const CELL_SIZE = 40
const NUM_MARGIN = 3

let render = (canvas: HTMLCanvasElement, state: GridState) => {
  let ctx = canvas.getContext('2d')!
  ctx.strokeStyle = '#aaa'
  ctx.font = 'Arial'
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (state.length === 0) {
    return
  }

  let width = state[0]!.length
  let height = state.length

  for (let row = 0; row < height; row++) {
    let y = CELL_SIZE * row + 1

    for (let col = 0; col < width; col++) {
      let x = CELL_SIZE * col + 1
      let cell = state[row]![col]!

      if (cell.flags & RenderCellFlags.Black) {
        ctx.fillStyle = '#000'
      } else {
        ctx.fillStyle = '#fff'
      }

      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)

      if (cell.num) {
        ctx.fillStyle = '#000'
        ctx.textBaseline = 'top'
        ctx.fillText(`${cell.num}`, x + NUM_MARGIN, y + NUM_MARGIN)
      }
    }
  }
}

let zoom = (ctx: CanvasRenderingContext2D, amount: number) => {
  let t = ctx.getTransform()
  let currentScale = t.a
  let newScale

  if (amount > 0) {
    newScale = Math.min(+2.0, currentScale + 0.1)
  } else {
    newScale = Math.max(0.5, currentScale - 0.1)
  }

  let newTransform = new DOMMatrix([newScale, t.b, t.c, newScale, t.e, t.f])
  ctx.setTransform(newTransform)
}

export let Grid = () => {
  let ref = useRef<HTMLCanvasElement>(null)
  let gridState = useSelector(getGridState)

  useEffect(() => {
    if (!ref.current) return

    let onWheel = (event: WheelEvent) => {
      zoom(ref.current?.getContext('2d')!, event.deltaY)
      render(ref.current!, gridState)
    }

    ref.current.addEventListener('wheel', onWheel)

    return () => ref.current?.removeEventListener('wheel', onWheel)
  }, [ref.current])

  useResize(() => {
    let parent = ref.current?.parentNode
    if (!(parent instanceof Element)) return

    let { width, height } = parent.getBoundingClientRect()

    ref.current!.width = width
    ref.current!.height = height

    render(ref.current!, gridState)
  })

  return <canvas ref={ref}></canvas>
}
