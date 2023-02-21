import { DEFAULT_COLOR, hslToRgb, parseHsl } from '../color'
import { CellRef, GameEvent, SendableGameEvent } from '../dfac-api'
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
  let ret: SendableGameEvent[] = []
  for (let action of actions) {
    if (action.type === 'SET_CELL') {
      let { cell, value } = action.payload
      let color = 'hsl(83,40%,69%)'
      let pencil = false
      let id = userId
      let timestamp = {
        '.sv': 'timestamp',
      }

      ret.push({
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
      })
    }
  }

  return ret
}
