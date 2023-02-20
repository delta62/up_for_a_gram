import { yellow, green } from 'chalk'
import { Grid } from './dfac-api'
import { State } from './store'
import { clear, hideCursor } from './term'
import { Block, block, render as uiRender, writeLine } from './ui'

let render = (state: State) => {
  clear()
  hideCursor()

  let header = block({ valign: 'start', halign: 'middle' })
  writeLine(state.game.title.trim(), header)
  writeLine(state.game.author.trim(), header)
  uiRender(header)

  let { r, c } = state.selection
  let clue = state.grid[r][c].parents?.[state.mode]
  let clueText = clue ? state.clues[state.mode][clue]! : ''

  if (clueText) {
    let displayText = `${clue} ${state.mode.toUpperCase()}: ${clueText}`
    let footer = block({ valign: 'end', halign: 'middle' })
    writeLine(displayText, footer)
    uiRender(footer)
  }

  let puzzle = block({ valign: 'middle', halign: 'middle' })
  renderPuzzle(state, puzzle)
  uiRender(puzzle)
}

let renderPuzzle = (state: State, block: Block) => {
  let width = state.grid[0].length
  let height = state.grid.length

  printHead(state.grid, width, block)

  for (let r = 0; r < height; r++) {
    let row = state.grid[r]
    let output = ['│']

    for (let c in row) {
      let selected =
        state.selection.r === r && state.selection.c === parseInt(c)
      let cell = row[c]
      if (cell.black) {
        output.push('███')
      } else {
        if (selected) {
          output.push(` ${yellow.underline(cell.value || ' ')} `)
        } else {
          output.push(` ${cell.value || ' '}`)

          let someoneElseSelected = Object.values(state.players).find(
            p => r === p.cursor.r && parseInt(c) === p.cursor.c
          )

          if (someoneElseSelected) {
            output.push(`${green('*')}`)
          } else {
            output.push(' ')
          }
        }
      }

      output.push('│')
    }

    writeLine(output.join(''), block)

    if (r !== height - 1) {
      printDivider(state.grid, width, r, block)
    }
  }

  printTail(width, block)
}

let printHead = (grid: Grid, width: number, block: Block) => {
  let chars = ['┌']

  let midChars = Array.from({ length: width }, (_, i) => {
    let num = grid[0][i].number
    let cellNum = numberToSubscript(num, 3, '─')

    if (i === width - 1) {
      return cellNum
    } else {
      return `${cellNum}┬`
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

let printDivider = (grid: Grid, width: number, row: number, block: Block) => {
  let chars = ['├']
  let midChars = Array.from({ length: width }, (_, i) => {
    let num = grid[row + 1][i].number

    if (i === width - 1) {
      return numberToSubscript(num, 3, '─')
    } else {
      return `${numberToSubscript(num, 3, '─')}┼`
    }
  })

  chars = chars.concat(midChars).concat('┤')

  writeLine(chars.join(''), block)
}

let numberToSubscript = (
  n: number | null,
  length: number,
  pad: string
): string => {
  if (n == null) {
    return Array.from<string>({ length }).fill(pad).join('')
  }

  let chars = []
  let s = `${n}`

  for (let i = 0; i < s.length; i++) {
    chars.push(String.fromCharCode(s.charCodeAt(i) + 0x2050))
  }

  while (chars.length < length) {
    chars.push(pad)
  }

  return chars.join('')
}

export default render
