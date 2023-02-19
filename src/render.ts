import { Game } from './game-state'
import { yellow } from 'chalk'
import { clear, hideCursor } from './term'
import { Block, block, render as uiRender, writeLine } from './ui'

let render = (game: Game) => {
  clear()
  hideCursor()

  let header = block({ valign: 'start', halign: 'middle' })
  writeLine(game.info.title.trim(), header)
  writeLine(game.info.author.trim(), header)
  uiRender(header)

  let footer = block({ valign: 'end', halign: 'middle' })
  writeLine('this is the footer', footer)
  uiRender(footer)

  let puzzle = block({ valign: 'middle', halign: 'middle' })
  renderPuzzle(game, puzzle)
  uiRender(puzzle)
}

let renderPuzzle = (game: Game, block: Block) => {
  let width = game.grid[0].length
  let height = game.grid.length

  printHead(width, block)

  for (let r = 0; r < height; r++) {
    let row = game.grid[r]
    let output = ['│']

    for (let c in row) {
      let selected = game.selection.r === r && game.selection.c === parseInt(c)
      let cell = row[c]
      if (cell.black) {
        output.push('█')
      } else {
        if (selected) {
          output.push(yellow.underline(cell.value) || ' ')
        } else {
          output.push(cell.value || ' ')
        }
      }

      output.push('│')
    }

    writeLine(output.join(' '), block)

    if (r !== height - 1) {
      printDivider(width, block)
    }
  }

  printTail(width, block)
}

let printHead = (width: number, block: Block) => {
  let chars = ['┌']

  let midChars = Array.from({ length: width }, (_, i) => {
    if (i === width - 1) {
      return '───'
    } else {
      return '───┬'
    }
  })

  chars = chars.concat(midChars).concat('┐')

  writeLine(chars.join(''), block)
}

let printTail = (width: number, block: Block) => {
  let chars = ['└']

  let midChars = Array.from({ length: width }, (_, i) => {
    if (i === width - 1) {
      return '───'
    } else {
      return '───┴'
    }
  })

  chars = chars.concat(midChars).concat('┘')

  writeLine(chars.join(''), block)
}

let printDivider = (width: number, block: Block) => {
  let chars = ['├']
  let midChars = Array.from({ length: width }, (_, i) => {
    if (i === width - 1) {
      return '───'
    } else {
      return '───┼'
    }
  })

  chars = chars.concat(midChars).concat('┤')

  writeLine(chars.join(''), block)
}

export default render
