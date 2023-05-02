import { onKeyPress } from './input'
import { userId } from './auth'
import render from './render'
import log from './log'
import { connect } from 'api'
import createStore from 'store'
import {
  keyPressToAction,
  gameEventToAction,
  localActionToRemoteAction,
} from './mappers'
import { showCursor } from './term'

let main = async (gameId: string) => {
  log.info('hello world')

  let uid = await userId()
  let client = await connect(gameId)
  let store = createStore()

  onKeyPress(key => {
    let state = store.getState()
    let actions = keyPressToAction(state, key)
    actions.forEach(store.dispatch)

    let remoteActions = localActionToRemoteAction(actions, uid, gameId)
    remoteActions.forEach(client.emit)
  })

  client.onGameEvent(event => {
    let state = store.getState()
    let action = gameEventToAction(event, state)
    store.dispatch(action)
  })

  // Sync all events so far prior to hooking up renders to avoid useless paints
  let initEvents = await client.syncAllEvents()
  initEvents.forEach(event => {
    let state = store.getState()
    let action = gameEventToAction(event, state)
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
  console.error(`usage: ${process.argv[1]} <game_id>`)
  process.exit(1)
}

if (['-h', '--help'].includes(gameId)) {
  console.log(`${process.argv[1]} <game_id>

An unofficial CLI frontend for downforacross.com

Key Bindings
------------

Arrow keys:    Move                            Alt-P:      Check puzzle
Spacebar:      Across/down toggle              Alt-W:      Check word
Tab:           Next clue                       Alt-C:      Check cell
S-Tab:         Previous clue                   S-Alt-P:    Reveal puzzle
Backspace:     Delete and move backward        S-Alt-W:    Reveal word
Delete:        Delete without moving           S-Alt-C:    Reveal cell
Ctrl-C:        Quit

Happy crosswording!
`)
  process.exit()
}

if (gameId.startsWith('http')) {
  gameId = gameId.replace(/.*\//, '')
}

main(gameId).catch(err => {
  showCursor()
  log.error(err)
  console.error(err)
})
