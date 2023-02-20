// import render from './render'
// import { Game, Event, updateGame, updateGameInput } from './game-state'
import { onKeyPress } from './input'
import log from './log'
import { connect } from './websocket'
import createStore, { gameAction, keyInput } from './store'

export const USER_ID = '84c2e26'

let main = async (gameId: string) => {
  log.info('hello world')

  let store = createStore()
  let client = await connect(gameId)

  onKeyPress(key => {
    store.dispatch(keyInput(key))
  })

  client.onGameEvent(event => {
    store.dispatch(gameAction(event))
  })

  // Sync all events so far prior to hooking up renders to avoid useless paints
  let initEvents = await client.syncAllEvents()
  initEvents.forEach(event => store.dispatch(gameAction(event)))

  store.subscribe(() => {
    let state = store.getState()
    // render(state)
  })

  // render(state)
}

let gameId = process.argv.at(2)

if (!gameId) {
  throw new Error(`usage: ${process.argv[1]} <game_id>`)
}

main(gameId)
  .catch(err => console.error(err))
  .then(() => console.log('done'))
