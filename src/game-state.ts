import { USER_ID, emit } from './index'
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

export type InputMode = 'down' | 'across'

export interface Player {
  id: string
  name: string
  position: CellRef
  color: string
}

export interface Game extends WsGame {
  selection: CellRef
  mode: InputMode
  players: Record<string, Player>
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

export interface UpdateCursorParams {
  cell: CellRef
  id: string
}

export interface UpdateDisplayNameParams {
  id: string
  displayName: string
}

export interface UpdateColorParams {
  id: string
  color: string
}

export interface UpdateColorEvent {
  type: 'updateColor'
  params: UpdateColorParams
}

export interface UpdateDisplayNameEvent {
  type: 'updateDisplayName'
  params: UpdateDisplayNameParams
}

export interface UpdateCursorEvent {
  type: 'updateCursor'
  params: UpdateCursorParams
}

// check / reveal: params.scope[0] = {r: 5, c: 2 }
export interface CheckEvent {
  type: 'check'
}
export interface RevealEvent {
  type: 'reveal'
}

export type Event =
  | CreateEvent
  | UpdateCellEvent
  | RevealEvent
  | CheckEvent
  | UpdateCursorEvent
  | UpdateDisplayNameEvent
  | UpdateColorEvent

export let updateGame = (game: Game, event: Event): Game => {
  switch (event.type) {
    case 'check':
      return game
    case 'reveal':
      return game
    case 'create':
      if (game !== null) {
        console.warn('creating a game from a non empty state')
      }

      return {
        selection: { r: 0, c: 0 },
        mode: 'across',
        players: {},
        ...event.params.game,
      }
    case 'updateCell':
      return updateCell(game, event.params.cell, event.params.value)
    case 'updateCursor':
      return updateCursor(game, event.params.cell, event.params.id)
    case 'updateDisplayName':
      return updateDisplayName(game, event.params.id, event.params.displayName)
    case 'updateColor':
      return updateColor(game, event.params.id, event.params.color)
    default:
      // console.error(`Unknown event type ${(event as any).type}`);
      // console.error(serialize(event));
      // console.error(serialize(event));
      return game
  }
}

const DEFAULT_PLAYER: Player = {
  id: '',
  color: '',
  position: { r: 0, c: 0 },
  name: '?',
}

let updateDisplayName = (game: Game, id: string, name: string): Game => {
  let player = {
    ...(game.players[id] || DEFAULT_PLAYER),
    name,
  }

  let players = {
    ...game.players,
    [id]: player,
  }

  return {
    ...game,
    players,
  }
}

let updateColor = (game: Game, id: string, color: string): Game => {
  let player = {
    ...(game.players[id] || DEFAULT_PLAYER),
    color,
  }

  let players = {
    ...game.players,
    [id]: player,
  }

  return {
    ...game,
    players,
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

let emitCellUpdate = async (
  gameId: string,
  socket: unknown,
  selection: CellRef,
  value: string
) => {
  value = value.toUpperCase()
  let cell = selection
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
    gid: gameId,
  }

  emit(socket, 'game_event', payload)
}

export let updateGameInput = (
  gameId: string,
  socket: unknown,
  game: Game,
  key: Key
): Game => {
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
    case 'delete':
      emitCellUpdate(gameId, socket, game.selection, '')
      return game
    case 'rotate':
      let mode: InputMode = game.mode === 'across' ? 'down' : 'across'
      return {
        ...game,
        mode,
      }
    default:
      emitCellUpdate(gameId, socket, game.selection, key.key)
      return game
  }
}

let updateCursor = (game: Game, cell: CellRef, id: string): Game => {
  let player = {
    ...(game.players[id] || DEFAULT_PLAYER),
    position: cell,
  }

  let players = {
    ...game.players,
    [id]: player,
  }

  return {
    ...game,
    players,
  }
}

let updateCell = (game: Game, cell: CellRef, value: string) => {
  let grid = [...game.grid]
  let { r, c } = cell

  let newCell = { ...grid[r][c], value }
  grid[r][c] = newCell

  return { ...game, grid }
}
