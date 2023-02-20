import { default as io, Client as WsClient, Transport } from 'socket.io-client'
import { GameEvent } from './dfac-api'
import log from './log'

const SOCKET_HOST = 'https://api.foracross.com'

export interface Client {
  syncAllEvents(): Promise<GameEvent[]>
  onGameEvent(callback: (event: GameEvent) => void): void
}

export type GameEventCallback = (event: GameEvent) => void

export let emit = <T>(socket: WsClient, ...args: any[]): Promise<T> => {
  return new Promise(resolve => socket.emit(...args, resolve))
}

export let connect = (gameId: string): Promise<Client> => {
  let upgrade = false
  let transports: Transport[] = ['websocket']
  let socket = io(SOCKET_HOST, { upgrade, transports })
  let onGameEvent: GameEventCallback | null = null

  return new Promise((resolve, reject) => {
    socket.on('connect', async () => {
      log.info('ws connected')

      await emit(socket, 'join_game', gameId)
      log.info(`joined game ${gameId}`)

      resolve({
        syncAllEvents: () => emit(socket, 'sync_all_game_events', gameId),
        onGameEvent: callback => (onGameEvent = callback),
      })
    })

    socket.on('connect_error', reject)
    socket.on('error', err => log.error(err))

    socket.on('game_event', (event: GameEvent) => {
      if (onGameEvent) onGameEvent(event)
    })

    socket.connect()
  })
}
