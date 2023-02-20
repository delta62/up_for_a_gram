import {
  CellRef,
  GameEvent,
  UpdateColorParams,
  UpdateCursorParams,
  UpdateDisplayNameParams,
} from '../dfac-api'
import Action from './actions'
import { hslToRgb, parseHsl, Rgb } from '../color'

export interface Player {
  id: string
  name: string
  color: Rgb
  cursor: CellRef
}

export type PlayersState = Record<string, Player>

const DEFAULT_STATE = {}

const DEFAULT_PLAYER = {
  id: '',
  name: '?',
  color: { r: 255, g: 0, b: 0 },
  cursor: { r: 0, c: 0 },
}

let updatePlayerCursor = (
  state: PlayersState,
  { id, cell }: UpdateCursorParams
) => {
  let player = {
    ...(state[id] ?? DEFAULT_PLAYER),
    id,
    cursor: cell,
  }

  return {
    ...state,
    [id]: player,
  }
}

let updatePlayerName = (
  state: PlayersState,
  { id, displayName }: UpdateDisplayNameParams
) => {
  let player = {
    ...(state[id] || DEFAULT_PLAYER),
    id,
    name: displayName,
  }

  return {
    ...state,
    [id]: player,
  }
}

let updatePlayerColor = (
  state: PlayersState,
  { id, color }: UpdateColorParams
) => {
  let hsl = parseHsl(color)!
  let rgb = hslToRgb(hsl)

  let player = {
    ...(state[id] || DEFAULT_PLAYER),
    id,
    color: rgb,
  }

  return {
    ...state,
    [id]: player,
  }
}

let reduceGameAction = (
  state: PlayersState,
  event: GameEvent
): PlayersState => {
  switch (event.type) {
    case 'updateCursor':
      return updatePlayerCursor(state, event.params)
    case 'updateDisplayName':
      return updatePlayerName(state, event.params)
    case 'updateColor':
      return updatePlayerColor(state, event.params)
    case 'create':
      return {}
    default:
      return state
  }
}

let players = (state = DEFAULT_STATE, action: Action): PlayersState => {
  if (action.type === 'GAME_ACTION') {
    return reduceGameAction(state, action.event)
  }

  return state
}

export default players
