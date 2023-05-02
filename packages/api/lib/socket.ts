import { default as io, Client as WsClient, Transport } from 'socket.io-client'
import { GameEvent, SendableGameEvent } from './index'

const SOCKET_HOST = 'https://api.foracross.com'

export interface Client {
  syncAllEvents(): Promise<void>
  onGameEvent(callback: (event: GameEvent) => void): void
  emit(event: SendableGameEvent): Promise<void>
  disconnect(): void
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
      await emit(socket, 'join_game', gameId)

      resolve({
        syncAllEvents: async () => {
          let events: GameEvent[] = await emit(
            socket,
            'sync_all_game_events',
            gameId
          )
          events.forEach(e => onGameEvent?.(e))
        },
        onGameEvent: callback => (onGameEvent = callback),
        emit: (event: SendableGameEvent) => {
          return emit(socket, 'game_event', event)
        },
        disconnect: () => socket.disconnect(),
      })
    })

    socket.on('connect_error', reject)
    socket.on('error', console.error.bind(console))

    socket.on('game_event', (event: GameEvent) => {
      if (onGameEvent) onGameEvent(event)
    })

    socket.connect()
  })
}
