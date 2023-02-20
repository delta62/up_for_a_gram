import { DEFAULT_COLOR, hslToRgb, parseHsl } from '../color'
import { GameEvent } from '../dfac-api'
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
