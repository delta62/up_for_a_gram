import { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { useResize } from '@hooks'
import { useDispatch, useSelector } from 'react-redux'
import {
  GridState,
  RenderCellFlags,
  getGridState,
  Dispatch,
  moveCursor,
  switchMode,
  updateCell,
} from 'store'

const CELL_SIZE = 40
const NUM_MARGIN = 3

let clear = (ctx: CanvasRenderingContext2D) => {
  ctx.save()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.restore()
}

let render = (canvas: HTMLCanvasElement, state: GridState) => {
  let ctx = canvas.getContext('2d')!
  clear(ctx)
  ctx.strokeStyle = '#aaa'

  if (state.length === 0) {
    return
  }

  let width = state[0]!.length
  let height = state.length

  for (let row = 0; row < height; row++) {
    let y = CELL_SIZE * row

    for (let col = 0; col < width; col++) {
      let x = CELL_SIZE * col
      let cell = state[row]![col]!

      if (cell.flags & RenderCellFlags.Black) {
        ctx.fillStyle = '#000'
      } else if (cell.flags & RenderCellFlags.Selected) {
        ctx.fillStyle = '#dde'
      } else if (cell.flags & RenderCellFlags.SelectedWord) {
        ctx.fillStyle = '#eee'
      } else {
        ctx.fillStyle = '#fff'
      }

      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)

      if (cell.num) {
        ctx.fillStyle = '#000'
        ctx.textBaseline = 'top'
        ctx.font = '10px Arial'
        ctx.fillText(`${cell.num}`, x + NUM_MARGIN, y + NUM_MARGIN)
      }

      if (cell.value) {
        ctx.textBaseline = 'middle'
        ctx.font = '18px Arial'

        let { width: textWidth } = ctx.measureText(cell.value)
        let textX = x + CELL_SIZE / 2 - textWidth / 2
        let textY = y + CELL_SIZE / 2

        ctx.fillText(cell.value, textX, textY)
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

let localCoords = (event: MouseEvent): DOMPoint => {
  let rect = event.currentTarget.getBoundingClientRect()
  let x = event.clientX - rect.x
  let y = event.clientY - rect.y

  return new DOMPoint(x, y)
}

let coordsToCell = (ctx: CanvasRenderingContext2D, point: DOMPoint) => {
  let transform = ctx.getTransform().inverse()
  let p = transform.transformPoint(point)
  let x = Math.floor(p.x / CELL_SIZE)
  let y = Math.floor(p.y / CELL_SIZE)

  return { x, y }
}

export let Grid = () => {
  let ref = useRef<HTMLCanvasElement>(null)
  let gridState = useSelector(getGridState)
  let dispatch = useDispatch<Dispatch>()

  let onClick = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      let point = localCoords(event)
      let ctx = event.currentTarget.getContext('2d')!
      let { x, y } = coordsToCell(ctx, point)
      let isBlack = (gridState[y]?.[x]?.flags ?? 0) & RenderCellFlags.Black
      let isSelectedCell =
        (gridState[y]?.[x]?.flags ?? 0) & RenderCellFlags.Selected

      if (isBlack) return

      if (isSelectedCell) {
        dispatch(switchMode())
      } else {
        dispatch(moveCursor({ r: y, c: x }))
      }

      ;(navigator as any).virtualKeyboard?.show()
    },
    [gridState, dispatch]
  )

  let onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      let value = event.key.toUpperCase()
      if (!/^[A-Z1-9]$/.test(value)) return

      let correct = false
      let cell = { r: 0, c: 0 }

      dispatch(updateCell({ value, correct, cell }))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!ref.current) return

    let onWheel = (event: WheelEvent) => {
      zoom(ref.current?.getContext('2d')!, event.deltaY)
      render(ref.current!, gridState)
    }

    ref.current.addEventListener('wheel', onWheel)

    return () => ref.current?.removeEventListener('wheel', onWheel)
  }, [ref.current])

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp)
    return () => window.removeEventListener('keyup', onKeyUp)
  }, [onKeyUp])

  useEffect(() => {
    if (!ref.current) return
    render(ref.current, gridState)
  }, [ref.current, gridState])

  useResize(
    useCallback(() => {
      let parent = ref.current?.parentNode
      if (!(parent instanceof Element)) return

      let { width, height } = parent.getBoundingClientRect()

      ref.current!.width = width
      ref.current!.height = height

      render(ref.current!, gridState)
    }, [])
  )

  return <canvas ref={ref} onClick={onClick}></canvas>
}
