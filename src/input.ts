import { stdin } from 'process'
import { showCursor } from './term'

export interface InputKey {
  key: string
}

export type Key = 'delete' | 'up' | 'down' | 'left' | 'right' | InputKey
export type KeyPressHandler = (key: Key) => void

const UP_ARROW = '\u001b\u005b\u0041'
const DOWN_ARROW = '\u001b\u005b\u0042'
const RIGHT_ARROW = '\u001b\u005b\u0043'
const LEFT_ARROW = '\u001b\u005b\u0044'
const BACKSPACE_KEY = '\u007f'
const DELETE_KEY = '\u001b\u005b\u0033\u007e'
const TAB_KEY = ''
const SPACE_KEY = '\u0009'
const SHIFT_TAB_KEY = '\u001b\u005b\u005a'

export let getKey = async (cb: KeyPressHandler): Promise<void> => {
  if (stdin.isTTY) {
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf-8')
  }

  stdin.on('data', (key: string) => {
    switch (key) {
      case DELETE_KEY:
      case BACKSPACE_KEY:
        cb('delete')
        break
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
          console.log('key', bytes, `"${key}"`)
        }
        break
    }

    if (key === '\u0003') {
      showCursor()
      process.exit()
    }
  })
}
