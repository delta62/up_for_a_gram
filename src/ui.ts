import { clearToScreenEnd, dimensions, moveTo } from './term'
import { strlen } from 'printable-characters'
import chalk from 'chalk'

export type Alignment = 'start' | 'middle' | 'end'

export interface Block {
  buffer: string[]
  height: number
  halign: Alignment
  valign: Alignment
}

export interface BlockOptions {
  height: number
  halign: Alignment
  valign: Alignment
}

export let block = (opts: Partial<BlockOptions>): Block => ({
  buffer: [],
  height: opts.height ?? 0,
  valign: opts.valign ?? 'start',
  halign: opts.halign ?? 'start',
})

export let writeLine = (str: string, block: Block) => {
  block.buffer.push(str)
}

export interface RenderOpts {
  clear: boolean
  wrap: boolean
}

let wrap = (text: string, width: number): string[] => {
  if (text.length <= width) return [text]

  let ret: string[] = []
  for (let i = 0; i < text.length; i += width) {
    ret.push(text.substring(i, width))
  }

  return ret
}

export let render = (block: Block, opts?: Partial<RenderOpts>) => {
  process.stdout.write(chalk.reset(''))

  let screen = dimensions()
  let lines = block.buffer
  if (opts?.wrap) {
    lines = wrap(lines.join(' '), screen.width)
  }

  let cursorY: number
  switch (block.valign) {
    case 'start':
      cursorY = 1
      break
    case 'middle':
      cursorY = Math.floor((screen.height - lines.length) / 2)
      break
    case 'end':
      if (block.height) {
        cursorY = screen.height - block.height
      } else {
        cursorY = screen.height - lines.length
      }
      break
  }

  if (opts?.clear) {
    moveTo(0, cursorY)
    clearToScreenEnd()
  }

  for (let line of lines) {
    let startX: number
    if (block.halign === 'middle') {
      let charWidth = strlen(line)
      startX = Math.max(Math.floor((screen.width - charWidth) / 2), 0)
    } else {
      startX = 1
    }

    moveTo(startX, cursorY)
    process.stdout.write(line)
    cursorY += 1
  }
}
