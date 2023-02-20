import { DEFAULT_COLOR, hslToRgb, parseHsl } from '../color'
import { GameEvent, SendableGameEvent } from '../dfac-api'
import { KeyPressAction } from './input'
import {
  check,
  createGame,
  reveal,
  updateCell,
  updatePlayerColor,
  updatePlayerCursor,
  updatePlayerName,
} from '../store'

export let gameEventToAction = (event: GameEvent) => {
  let playerId: string

  switch (event.type) {
    case 'create':
      return createGame({ game: event.params.game })
    case 'updateCell':
      return updateCell({ cell: event.params.cell, value: event.params.value })
    case 'updateColor':
      let hsl = parseHsl(event.params.color) || DEFAULT_COLOR
      let color = hslToRgb(hsl)

      return updatePlayerColor({
        playerId: event.params.id,
        color,
      })
    case 'updateCursor':
      playerId = event.params.id
      let cell = event.params.cell
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
  action: KeyPressAction,
  userId: string,
  gameId: string
): SendableGameEvent | null => {
  switch (action.type) {
    case 'SET_CELL':
      let { cell, value } = action.payload
      let color = 'hsl(83,40%,69%)'
      let pencil = false
      let id = userId
      let timestamp = {
        '.sv': 'timestamp',
      }

      return {
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
    default:
      return null
  }
}
