import { Action } from 'redux'
import { GameEvent } from '../dfac-api'
import { Key } from '../input'

export interface GameAction extends Action<'GAME_ACTION'> {
  event: GameEvent
}

export let gameAction = (event: GameEvent): GameAction => ({
  type: 'GAME_ACTION',
  event,
})

export let keyInput = (key: Key): KeyInputAction => ({
  type: 'KEY_INPUT',
  key,
})

export interface KeyInputAction extends Action<'KEY_INPUT'> {
  key: Key
}

type AppAction = GameAction | KeyInputAction

export default AppAction
