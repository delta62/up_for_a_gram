import { GAME_ID, USER_ID, emit } from './index'
import { Key } from './input'

export interface GameInfo {
  title: string
  author: string
}

export type Grid = GridRow[]

export type GridRow = GridCell[]

export interface Parents {
  across: number
  down: number
}

export interface GridCell {
  black: boolean
  value: string
  number: number | null
  parents?: Parents
}

export type SolutionRow = string[]

export interface Clues {
  across: (string | null)[]
  down: (string | null)[]
}

export interface WsGame {
  circles: unknown
  clues: Clues
  grid: Grid
  info: GameInfo
  solution: SolutionRow[]
}

export interface Game extends WsGame {
  selection: CellRef
}

export interface CreateEvent {
  type: 'create'
  params: { game: WsGame }
}

export interface CellRef {
  r: number
  c: number
}

export interface UpdateCellParams {
  cell: CellRef
  value: string
}

export interface UpdateCellEvent {
  type: 'updateCell'
  params: UpdateCellParams
}

// check / reveal: params.scope[0] = {r: 5, c: 2 }
export interface CheckEvent {
  type: 'check'
}
export interface RevealEvent {
  type: 'reveal'
}

export type Event = CreateEvent | UpdateCellEvent | RevealEvent | CheckEvent

export let updateGame = (game: Game, event: Event): Game => {
  switch (event.type) {
    case 'check':
      return game
    case 'reveal':
      return game
    case 'create':
      if (game !== null) {
        throw new Error('creating a game from a non empty state')
      }

      return {
        selection: { r: 0, c: 0 },
        ...event.params.game,
      }
    case 'updateCell':
      return updateCell(game, event.params.cell, event.params.value)
    default:
      // console.error(`Unknown event type ${(event as any).type}`);
      // console.error(serialize(event));
      // console.error(serialize(event));
      return game
  }
}

let selectable = (grid: Grid, { r, c }: CellRef): boolean => {
  return !grid[r][c].black
}

let findSelectionUp = (grid: Grid, selection: CellRef): CellRef => {
  let pointer = selection

  while (pointer.r > 0) {
    pointer = { r: pointer.r - 1, c: pointer.c }
    if (selectable(grid, pointer)) {
      return pointer
    }
  }

  return selection
}

let findSelectionDown = (grid: Grid, selection: CellRef): CellRef => {
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

let findSelectionLeft = (grid: Grid, selection: CellRef): CellRef => {
  let pointer = selection

  while (pointer.c > 0) {
    pointer = { c: pointer.c - 1, r: pointer.r }
    if (selectable(grid, pointer)) {
      return pointer
    }
  }

  return selection
}

let findSelectionRight = (grid: Grid, selection: CellRef): CellRef => {
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

export let updateGameInput = (socket: unknown, game: Game, key: Key): Game => {
  let selection: CellRef

  switch (key) {
    case 'up':
      selection = findSelectionUp(game.grid, game.selection)
      return {
        ...game,
        selection,
      }
    case 'down':
      selection = findSelectionDown(game.grid, game.selection)
      return {
        ...game,
        selection,
      }
    case 'left':
      selection = findSelectionLeft(game.grid, game.selection)
      return {
        ...game,
        selection,
      }
    case 'right':
      selection = findSelectionRight(game.grid, game.selection)
      return {
        ...game,
        selection,
      }
    default:
      let value = key.key.toUpperCase()
      let cell = game.selection
      let color = 'hsl(83,40%,69%)'
      let pencil = false
      let id = USER_ID
      let timestamp = {
        '.sv': 'timestamp',
      }

      let payload = {
        event: {
          timestamp,
          type: 'updateCell',
          params: {
            cell,
            value,
            color,
            pencil,
            id,
          },
        },
        gid: GAME_ID,
      }

      emit(socket, 'game_event', payload)

      return game
  }
}

let updateCell = (game: Game, cell: CellRef, value: string) => {
  let grid = [...game.grid]
  let { r, c } = cell

  let newCell = { ...grid[r][c], value }
  grid[r][c] = newCell

  return { ...game, grid }
}
