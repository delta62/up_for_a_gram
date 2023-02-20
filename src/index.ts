import { onKeyPress } from './input'
import render from './render'
import log from './log'
import { connect } from './websocket'
import store from './store'
import { keyPressToAction, gameEventToAction } from './mappers'

export const USER_ID = '84c2e26'

let main = async (gameId: string) => {
  log.info('hello world')

  let client = await connect(gameId)

  onKeyPress(key => {
    let state = store.getState()
    let action = keyPressToAction(state, key)
    store.dispatch(action)
  })

  client.onGameEvent(event => {
    let action = gameEventToAction(event)
    store.dispatch(action)
  })

  // Sync all events so far prior to hooking up renders to avoid useless paints
  let initEvents = await client.syncAllEvents()
  initEvents.forEach(event => {
    let action = gameEventToAction(event)
    store.dispatch(action)
  })

  store.subscribe(() => {
    let state = store.getState()
    render(state)
  })

  render(store.getState())
}

let gameId = process.argv.at(2)

if (!gameId) {
  throw new Error(`usage: ${process.argv[1]} <game_id>`)
}

main(gameId).catch(err => console.error(err))
