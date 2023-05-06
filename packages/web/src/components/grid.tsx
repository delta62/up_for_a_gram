import { MouseEvent, useCallback, useEffect, useRef, WheelEvent } from 'react'
import { useResize } from '@hooks'
import { useDispatch, useSelector } from 'react-redux'
import {
  RenderCellFlags,
  getGridState,
  Dispatch,
  moveCursor,
  switchMode,
  updateCell,
  getSelection,
  getSolution,
  getSolved,
  getClueSolved,
  getMode,
} from 'store'
import { getCells } from 'store/lib/selectors'
import { coordsToCell, render, zoom } from 'canvas'
import { nextInWord, nextInGrid } from 'selection'

let localCoords = (event: MouseEvent): DOMPoint => {
  let rect = event.currentTarget.getBoundingClientRect()
  let x = event.clientX - rect.x
  let y = event.clientY - rect.y

  return new DOMPoint(x, y)
}

export let Grid = () => {
  let ref = useRef<HTMLCanvasElement>(null)
  let dispatch = useDispatch<Dispatch>()
  let gridState = useSelector(getGridState)
  let solution = useSelector(getSolution)
  let selection = useSelector(getSelection)
  let isSolved = useSelector(getSolved)
  let isClueSolved = useSelector(getClueSolved)
  let mode = useSelector(getMode)
  let grid = useSelector(getCells)

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

      let cell = selection
      if (!selection) return

      let correct = solution[cell.r]?.[cell.c] === value
      dispatch(updateCell({ value, correct, cell }))

      if (isSolved) return

      let moveTarget
      if (isClueSolved) {
        moveTarget = nextInGrid(grid, selection, mode)
      } else {
        moveTarget = nextInWord(grid, selection, mode)
      }

      dispatch(moveCursor(moveTarget))
    },
    [dispatch, gridState, selection, solution, isClueSolved, mode, grid]
  )

  let onWheel = useCallback(
    (event: WheelEvent) => {
      zoom(ref.current?.getContext('2d')!, event.deltaY)
      render(ref.current!, gridState)
    },
    [gridState]
  )

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

  return <canvas ref={ref} onClick={onClick} onWheel={onWheel}></canvas>
}
