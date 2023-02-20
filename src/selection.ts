import { CellRef, Clues, Grid, InputMode } from './dfac-api'

let selectable = (grid: Grid, { r, c }: CellRef): boolean => {
  return !grid[r][c].black
}

export let findSelectionUp = (grid: Grid, selection: CellRef): CellRef => {
  let pointer = selection

  while (pointer.r > 0) {
    pointer = { r: pointer.r - 1, c: pointer.c }
    if (selectable(grid, pointer)) {
      return pointer
    }
  }

  return selection
}

export let findSelectionDown = (grid: Grid, selection: CellRef): CellRef => {
  let pointer = selection
  let height = grid.length

  while (pointer.r < height - 1) {
    pointer = { r: pointer.r + 1, c: pointer.c }
    if (selectable(grid, pointer)) {
      return pointer
    }
  }

  return selection
}

export let findSelectionLeft = (grid: Grid, selection: CellRef): CellRef => {
  let pointer = selection

  while (pointer.c > 0) {
    pointer = { c: pointer.c - 1, r: pointer.r }
    if (selectable(grid, pointer)) {
      return pointer
    }
  }

  return selection
}

export let findSelectionRight = (grid: Grid, selection: CellRef): CellRef => {
  let pointer = selection
  let width = grid[0].length

  while (pointer.c < width - 1) {
    pointer = { c: pointer.c + 1, r: pointer.r }
    if (selectable(grid, pointer)) {
      return pointer
    }
  }

  return selection
}

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
