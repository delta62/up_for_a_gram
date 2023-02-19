import { dimensions, moveTo } from './term'
import { first, strlen } from 'printable-characters'

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

export let render = (block: Block) => {
  let screen = dimensions()
  let lines = block.buffer

  let cursorY: number
  switch (block.valign) {
    case 'start':
      cursorY = 1
      break
    case 'middle':
      cursorY = Math.floor((screen.height - lines.length) / 2)
      break
    case 'end':
      cursorY = screen.height - 1
      break
  }

  for (let line of lines) {
    let charWidth = strlen(line)
    let startX: number
    if (block.halign === 'middle') {
      startX = Math.floor((screen.width - charWidth) / 2)
    } else {
      startX = 1
    }

    let availWidth = screen.width - startX

    moveTo(startX, cursorY)
    console.log(first(line, availWidth))
    cursorY += 1
  }
}
