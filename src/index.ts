import { keyPressToAction, onKeyPress } from './input'
import log from './log'
import { connect } from './websocket'
import store from './store'

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
    // store.dispatch(gameAction(event))
  })

  // Sync all events so far prior to hooking up renders to avoid useless paints
  let initEvents = await client.syncAllEvents()
  // initEvents.forEach(event => store.dispatch(gameAction(event)))

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
