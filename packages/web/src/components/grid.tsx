import { useEffect, useRef } from 'react'
import { useResize, ResizeArgs } from '@hooks'

const CELL_SIZE = 40
const NUM_MARGIN = 3

enum CellFlags {
  None = 0,
  Black = 1,
}

interface Cell {
  flags: CellFlags
  value?: string
  num?: number
}

interface GridState {
  cells: Cell[][]
  translateX: number
  translateY: number
  scale: number
}

let testState: GridState = {
  cells: [
    [
      { flags: CellFlags.Black },
      { flags: CellFlags.None, num: 1 },
      { flags: CellFlags.None, num: 2 },
    ],
    [
      { flags: CellFlags.None, num: 3 },
      { flags: CellFlags.Black },
      { flags: CellFlags.None },
    ],
    [
      { flags: CellFlags.None, num: 4 },
      { flags: CellFlags.None },
      { flags: CellFlags.Black },
    ],
  ],
  translateX: 0,
  translateY: 0,
  scale: 1,
}

let render = (canvas: HTMLCanvasElement, state: GridState) => {
  let ctx = canvas.getContext('2d')!
  ctx.strokeStyle = '#aaa'
  ctx.font = 'Arial'
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let width = state.cells[0].length
  let height = state.cells.length

  for (let row = 0; row < height; row++) {
    let y = CELL_SIZE * row + 1

    for (let col = 0; col < width; col++) {
      let x = CELL_SIZE * col + 1
      let cell = state.cells[row][col]

      if (cell.flags & CellFlags.Black) {
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
  ctx.scale(state.scale, state.scale)
}

let zoom = (state: GridState, amount: number) => {
  if (amount < 0) {
    state.scale = 0.9
  } else {
    state.scale = 1.1
  }
}

export let Grid = () => {
  let ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return

    let onWheel = (event: WheelEvent) => {
      zoom(testState, event.deltaY)
      render(ref.current!, testState)
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

    render(ref.current!, testState)
  })

  return <canvas ref={ref}></canvas>
}
