import { stdin } from 'process'

export interface InputKey {
  key: string
}

export type Key = 'up' | 'down' | 'left' | 'right' | InputKey
export type KeyPressHandler = (key: Key) => void

const UP_ARROW = '\u001b\u005b\u0041'
const DOWN_ARROW = '\u001b\u005b\u0042'
const RIGHT_ARROW = '\u001b\u005b\u0043'
const LEFT_ARROW = '\u001b\u005b\u0044'

export let getKey = async (cb: KeyPressHandler): Promise<Key> => {
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf-8')

  stdin.on('data', (key: string) => {
    switch (key) {
      case UP_ARROW:
        cb('up')
        break
      case DOWN_ARROW:
        cb('down')
        break
      case LEFT_ARROW:
        cb('left')
        break
      case RIGHT_ARROW:
        cb('right')
        break
      default:
        if (/[a-z0-9]$/.test(key)) {
          cb({ key })
        } else {
          let bytes = Buffer.from(key)
          console.log('key', key, bytes)
        }
        break
    }

    if (key === '\u0003') {
      process.exit()
    }
  })

  return 'up'
}
