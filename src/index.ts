import io from 'socket.io-client'
import render from './render'
import { Game, Event, updateGame, updateGameInput } from './game-state'
import { getKey } from './input'

const SOCKET_HOST = 'https://api.foracross.com'
const USER_ID = '84c2e26'
const GAME_ID = '2896420-skob'

let emit = <T>(socket: unknown, ...args: any[]): Promise<T> => {
  return new Promise(resolve => {
    ;(socket as any).emit(...args, (data: T) => {
      resolve(data)
    })
  })
}

let main = async () => {
  let upgrade = false
  let transports = ['websocket']
  let socket = io(SOCKET_HOST, { upgrade, transports })
  let game: Game = null as any

  getKey(key => {
    game = updateGameInput(game, key)
    render(game)
  })

  socket.on('connect', async () => {
    console.log('ws connected')

    await emit(socket, 'join_game', GAME_ID)
    console.log(`joined game ${GAME_ID}`)

    let result = await emit<Event[]>(socket, 'sync_all_game_events', GAME_ID)
    for (let event of result) {
      game = updateGame(game!, event)
    }

    render(game)
  })

  socket.on('error', (...args: any[]) => {
    console.log('error', args)
  })

  socket.on('connect_timeout', (err: any) => {
    console.error(err)
  })

  socket.on('connect_error', (err: any) => {
    console.error(err)
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.on('reconnect', () => {
    console.log('reconnect')
  })

  socket.on('reconnnect_attempt', () => {
    console.log('reconnect_attempt')
  })

  socket.on('reconnecting', () => {
    console.log('reconnecting')
  })

  socket.on('reconnect_error', () => {
    console.log('reconnect_error')
  })

  socket.on('reconnect_failed', () => {
    console.log('reconnect_failed')
  })

  socket.on('ping', () => {
    // console.debug("[ws ping]", Date.now());
  })

  socket.on('pong', () => {
    // console.debug("[ws pong]", Date.now());
  })

  socket.on('room_event', (event: any) => {
    console.log('room event', event)
  })

  socket.on('game_event', (event: Event) => {
    game = updateGame(game!, event)
    render(game)
  })

  socket.connect()
}

main()
  .catch(err => console.error(err))
  .then(() => console.log('done'))
