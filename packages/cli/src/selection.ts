import { CellRef, Clues, Grid, InputMode } from './dfac-api'

let selectable = (grid: Grid, { r, c }: CellRef): boolean => {
  return !grid[r]![c]!.black
}

interface Dimensions {
  width: number
  height: number
}

interface SelectOpts {
  increment(cell: CellRef): CellRef
  until(cell: CellRef & Dimensions): boolean
}

let select = (opts: SelectOpts) => (grid: Grid, from: CellRef) => {
  let { increment, until } = opts
  let width = grid[0]!.length
  let height = grid.length
  let pointer = from

  while (!until({ ...pointer, width, height })) {
    pointer = increment(pointer)
    if (selectable(grid, pointer)) return pointer
  }

  return from
}

export let moveUp = select({
  until: ({ r }) => r === 0,
  increment: cell => ({ ...cell, r: cell.r - 1 }),
})

export let moveDown = select({
  until: ({ r, height }) => r === height - 1,
  increment: cell => ({ ...cell, r: cell.r + 1 }),
})

export let moveLeft = select({
  until: ({ c }) => c === 0,
  increment: cell => ({ ...cell, c: cell.c - 1 }),
})

export let moveRight = select({
  until: ({ c, width }) => c === width - 1,
  increment: cell => ({ ...cell, c: cell.c + 1 }),
})

let invert = (mode: InputMode): InputMode => {
  return mode === 'across' ? 'down' : 'across'
}

let noEmptySpaces = (grid: Grid): boolean => {
  return grid
    .flat()
    .filter(cell => !cell.black)
    .every(cell => !!cell.value)
}

let tryMoveOnce = (
  grid: Grid,
  mode: InputMode,
  selection: CellRef
): CellRef | null => {
  if (mode === 'across') {
    let width = grid[0]!.length
    let { r, c } = selection
    c += 1
    return c < width && !grid[r]![c]!.black ? { r, c } : null
  } else {
    let height = grid.length
    let { r, c } = selection
    r += 1
    return r < height && !grid[r]![c]!.black ? { r, c } : null
  }
}

let tryMoveBackOnce = (
  grid: Grid,
  mode: InputMode,
  selection: CellRef
): CellRef | null => {
  if (mode === 'across') {
    let { r, c } = selection
    c -= 1
    return c >= 0 && !grid[r]![c]!.black ? { r, c } : null
  } else {
    let { r, c } = selection
    r -= 1
    return r >= 0 && !grid[r]![c]!.black ? { r, c } : null
  }
}

let firstOfType = (grid: Grid, mode: InputMode): CellRef | null => {
  return (
    grid
      .flatMap((row, r) => row.map((cell, c) => ({ ...cell, r, c })))
      .filter(cell => !cell.black)
      .find(cell => cell.parents?.[mode] != null) || null
  )
}

let lastOfType = (grid: Grid, mode: InputMode): CellRef | null => {
  return (
    grid
      .flatMap((row, r) => row.map((cell, c) => ({ ...cell, r, c })))
      .reverse()
      .filter(cell => !cell.black)
      .find(cell => cell.parents?.[mode] != null) || null
  )
}

/**
 * Move to the next cell in the current mode
 * - If the next cell is out out of bounds or blank, move to the next clue
 * - If no more clues exist in this mode, switch the mode and move to the
 *   first clue
 */
export let nextCell = (
  grid: Grid,
  mode: InputMode,
  clues: Clues,
  selection: CellRef
): [InputMode, CellRef] => {
  if (noEmptySpaces(grid)) return [mode, selection]

  let adjacentCell = tryMoveOnce(grid, mode, selection)
  if (adjacentCell) return [mode, adjacentCell]

  let nextWordCell = moveToNext(grid, mode, clues, selection)
  if (nextWordCell) return [mode, nextWordCell]

  mode = invert(mode)
  let firstOfOtherType = firstOfType(grid, mode)
  return [mode, firstOfOtherType!]
}

export let prevCell = (
  grid: Grid,
  mode: InputMode,
  clues: Clues,
  selection: CellRef
): [InputMode, CellRef] => {
  if (noEmptySpaces(grid)) return [mode, selection]

  let adjacentCell = tryMoveBackOnce(grid, mode, selection)
  if (adjacentCell) return [mode, adjacentCell]

  let prevWordCell = moveToPrev(grid, mode, clues, selection)
  if (prevWordCell) return [mode, prevWordCell]

  mode = invert(mode)
  let lastOfOtherType = lastOfType(grid, mode)
  return [mode, lastOfOtherType!]
}

export let moveToNext = (
  grid: Grid,
  mode: InputMode,
  clues: Clues,
  selection: CellRef
): CellRef => {
  let { r, c } = selection
  let origin = grid[r]![c]!.parents?.[mode]!
  let target = clues[mode].map(c => !!c).findIndex((c, i) => c && i > origin!)

  if (target === -1) {
    // nothing else left to go to
    return selection
  }

  // TODO will select completed words
  return grid
    .flatMap((row, r) => row.map((cell, c) => ({ ...cell, r, c })))
    .find(cell => cell.parents?.[mode] === target)!
}

export let moveToPrev = (
  grid: Grid,
  mode: InputMode,
  clues: Clues,
  selection: CellRef
): CellRef => {
  let { r, c } = selection
  let origin = grid[r]![c]!.parents?.[mode]!
  let target = clues[mode].reduce((acc, clue, i) => {
    if (!!clue && i < origin) return i
    return acc
  }, origin)

  // TODO will select completed words
  return grid
    .flatMap((row, r) => row.map((cell, c) => ({ ...cell, r, c })))
    .find(cell => cell.parents?.[mode] === target)!
}
