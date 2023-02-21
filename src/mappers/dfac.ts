import { DEFAULT_COLOR, hslToRgb, parseHsl } from '../color'
import {
  CellRef,
  CheckEvent,
  GameEvent,
  RevealEvent,
  SendableGameEvent,
  SendableProps,
  SetCellEvent,
} from '../dfac-api'
import { KeyPressAction } from './input'
import {
  check,
  createGame,
  reveal,
  State,
  updateCell,
  updatePlayerColor,
  updatePlayerCursor,
  updatePlayerName,
} from '../store'
import { v4 as uuid4 } from 'uuid'

const SERVER_TIMESTAMP = {
  '.sv': 'timestamp',
}

export let gameEventToAction = (event: GameEvent, state: State) => {
  let playerId: string
  let cell: CellRef
  let value: string

  switch (event.type) {
    case 'create':
      return createGame({ game: event.params.game })
    case 'updateCell':
      ;({ cell, value } = event.params)
      let correct = state.solution[cell.r][cell.c] === value
      return updateCell({ cell, value, correct })
    case 'updateColor':
      let hsl = parseHsl(event.params.color) || DEFAULT_COLOR
      let color = hslToRgb(hsl)

      return updatePlayerColor({
        playerId: event.params.id,
        color,
      })
    case 'updateCursor':
      playerId = event.params.id
      cell = event.params.cell
      return updatePlayerCursor({ playerId, cell })
    case 'updateDisplayName':
      playerId = event.params.id
      let name = event.params.displayName
      return updatePlayerName({ playerId, name })
    case 'check':
      return check({ scope: event.params.scope })
    case 'reveal':
      return reveal({ scope: event.params.scope })
    default:
      throw new Error('not implemented ' + (event as any).type)
  }
}

export let localActionToRemoteAction = (
  actions: KeyPressAction,
  userId: string,
  gameId: string
): SendableGameEvent[] => {
  let ret: SendableGameEvent['event'][] = []
  let scope: CellRef[]

  for (let action of actions) {
    switch (action.type) {
      case 'SET_CELL':
        let { cell, value } = action.payload
        ret.push(createUpdateEvent(userId, cell, value))
        break
      case 'START_REVEAL':
        scope = action.payload.scope
        ret.push(createRevealEvent(scope))
        break
      case 'START_CHECK':
        scope = action.payload.scope
        ret.push(createCheckEvent(scope))
        break
    }
  }

  return ret.map(event => ({ event, gid: gameId }))
}

let createRevealEvent = (scope: CellRef[]): RevealEvent & SendableProps => ({
  type: 'reveal',
  timestamp: SERVER_TIMESTAMP,
  id: uuid4(),
  params: {
    scope,
  },
})

let createCheckEvent = (scope: CellRef[]): CheckEvent & SendableProps => ({
  type: 'check',
  timestamp: SERVER_TIMESTAMP,
  id: uuid4(),
  params: {
    scope,
  },
})

let createUpdateEvent = (
  userId: string,
  cell: CellRef,
  value: string
): SetCellEvent & SendableProps => ({
  timestamp: SERVER_TIMESTAMP,
  type: 'updateCell',
  id: uuid4(),
  params: {
    cell,
    value,
    color: 'hsl(83,40%,69%)',
    pencil: false,
    id: userId,
  },
})
