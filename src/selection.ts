import { CellRef, Clues, Grid, InputMode } from './dfac-api'

let selectable = (grid: Grid, { r, c }: CellRef): boolean => {
  return !grid[r][c].black
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
  let width = grid[0].length
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

export let findNextSelection = (
  grid: Grid,
  mode: InputMode,
  clues: Clues,
  selection: CellRef
): CellRef => {
  let { r, c } = selection

  if (mode === 'across') {
    let origin = grid[r][c].parents?.across!
    let target = clues.across
      .map(c => !!c)
      .findIndex((c, i) => c && i > origin!)

    if (target === -1) {
      // nothing else left to go to
      return selection
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col].parents?.across === target) {
          return { r: row, c: col }
        }
      }
    }

    throw new Error('should not get here')
  } else {
    let origin = grid[r][c].parents?.down!
    let target = clues.down.map(c => !!c).findIndex((c, i) => c && i > origin!)

    if (target === -1) {
      // nothing else left to go to
      return selection
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col].parents?.down === target) {
          return { r: row, c: col }
        }
      }
    }

    throw new Error('should not get here')
  }
}

export let findPrevSelection = (
  grid: Grid,
  mode: InputMode,
  clues: Clues,
  selection: CellRef
): CellRef => {
  let { r, c } = selection

  if (mode === 'across') {
    let origin = grid[r][c].parents?.across!
    let target = clues.across
      .map(c => !!c)
      .findIndex((c, i) => c && i < origin!)

    if (target === -1) {
      // nothing else left to go to
      return selection
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col].parents?.across === target) {
          return { r: row, c: col }
        }
      }
    }

    throw new Error('should not get here')
  } else {
    let origin = grid[r][c].parents?.down!
    let target = clues.down.map(c => !!c).findIndex((c, i) => c && i < origin!)

    if (target === -1) {
      // nothing else left to go to
      return selection
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col].parents?.down === target) {
          return { r: row, c: col }
        }
      }
    }

    throw new Error('should not get here')
  }
}
