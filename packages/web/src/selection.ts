import { CellRef } from 'api'
import { Cell } from 'store/lib/grid'
import { ModeState } from 'store/lib/mode'
import { SelectionState } from 'store/lib/selection'

type MoveAlgorithm = (
  grid: Cell[][],
  selection: SelectionState,
  mode: ModeState
) => CellRef

export let nextInWord: MoveAlgorithm = (grid, selection, mode) => {
  console.log('nextInWord')
  let wordNum = grid[selection.r]?.[selection.c]?.parents?.[mode]

  return grid
    .flatMap((row, r) =>
      row
        .map((cell, c) => ({ r, c, ...cell }))
        .filter(cell => cell.parents?.[mode] === wordNum)
        .filter(cell => !cell.value)
    )
    .filter(x => x.r !== selection.r || x.c !== selection.c)
    .map(x => ({ r: x.r, c: x.c }))[0]!
}

export let nextInGrid: MoveAlgorithm = (grid, selection, mode) => {
  console.log('nextInGrid')
  let height = grid.length
  let width = grid[0]?.length ?? 0
  let firstDone = false

  if (mode === 'across') {
    for (let r = selection.r; ; r = (r + 1) % height) {
      for (let c = selection.c; ; c = (c + 1) % width) {
        if (grid[r]?.[c]?.black) continue
        if (r === selection.r && c === selection.c) {
          if (firstDone) throw new Error('overflow')
          firstDone = true
          continue
        }

        if (!grid[r]?.[c]?.value) return { r, c }
      }
    }
  }

  for (let c = selection.c; ; c = (c + 1) % width) {
    for (let r = selection.r; ; r = (r + 1) % height) {
      if (grid[r]?.[c]?.black) continue
      if (r === selection.r && c === selection.c) {
        if (firstDone) throw new Error('overflow')
        firstDone = true
        continue
      }

      if (!grid[r]?.[c]?.value) return { r, c }
    }
  }
}
