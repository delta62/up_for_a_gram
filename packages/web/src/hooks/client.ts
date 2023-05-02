import { useEffect } from 'react'
import { connect, GameEvent } from 'api'

export type OnEventCallback = (event: GameEvent) => void

export let useSocket = (gameId: string, onEvent: OnEventCallback) => {
  useEffect(() => {
    let connPromise = connect(gameId)
      .then(conn => {
        conn.onGameEvent(onEvent)
        return conn
      })
      .then(conn => {
        conn.syncAllEvents()
        return conn
      })

    return () => {
      connPromise.then(conn => conn.disconnect())
    }
  }, [gameId, onEvent])
}
