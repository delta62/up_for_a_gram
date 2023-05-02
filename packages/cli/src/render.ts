import chalk from 'chalk'
import { Grid } from './dfac-api'
import { getClueSolved, getSolved, State } from 'store'
import { clear, hideCursor } from './term'
import { Block, block, render as uiRender, writeLine } from './ui'
import log from './log'

let initialRender = true

let render = (state: State) => {
  if (initialRender) {
    clear()
    initialRender = false
  }

  hideCursor()

  let header = block({ valign: 'start', halign: 'middle' })
  if (getSolved(state)) {
    writeLine(chalk.green(` ${state.game.title.trim()}`), header)
    writeLine(chalk.green(state.game.author.trim()), header)
  } else {
    writeLine(state.game.title.trim(), header)
    writeLine(state.game.author.trim(), header)
  }
  uiRender(header)

  let { r, c } = state.selection

  let clue = state.grid.cells[r]![c]!.parents?.[state.mode]
  let clueText = clue ? state.clues[state.mode][clue]! : ''

  if (clueText) {
    let footer = block({ height: 3, valign: 'end', halign: 'middle' })
    let displayText = `${clue} ${state.mode.toUpperCase()}: ${clueText}`
    log.debug({ displayText })
    if (getClueSolved(state, { r, c })) {
      displayText = chalk.dim(displayText)
    }

    writeLine(displayText, footer)
    uiRender(footer, { clear: true, wrap: true })
  }

  let puzzle = block({ valign: 'middle', halign: 'middle' })
  renderPuzzle(state, puzzle)
  uiRender(puzzle)
}

let renderPuzzle = (state: State, block: Block) => {
  let { width, height } = state.grid
  let isSolved = getSolved(state)

  printHead(state.grid.cells, width, block)

  for (let r = 0; r < height; r++) {
    let row = state.grid.cells[r]
    let output = ['│']
    let { selection } = state

    for (let c in row) {
      let cell = row[parseInt(c, 10)]!
      if (cell.black) {
        output.push('███')
      } else {
        let selected = selection.r === r && selection.c === parseInt(c)
        let selectedCell = state.grid.cells[selection.r]![selection.c]!
        let otherFocused = Object.values(state.players).find(
          p => r === p.cursor.r && parseInt(c) === p.cursor.c
        )
        let correct = cell.state === 'verified'
        let incorrect = cell.state === 'incorrect'
        let revealed = cell.state === 'revealed'
        let selectedWord = selectedCell.parents?.[state.mode]
        let inWord = cell.parents?.[state.mode] === selectedWord

        let style =
          (isSolved && chalk.green) ||
          (revealed && chalk.green) ||
          (selected && chalk.yellow) ||
          (correct && chalk.blue) ||
          (incorrect && chalk.red) ||
          chalk.reset

        if (selected) {
          style = style.underline
        }

        let wsStyle = style.reset
        if (inWord) {
          style = style.bgGrey
          wsStyle = wsStyle.bgGrey
        }

        let text =
          wsStyle(' ') +
          style(cell.value || ' ') +
          wsStyle(otherFocused ? '*' : ' ')

        output.push(text)
      }

      output.push('│')
    }

    writeLine(output.join(''), block)

    if (r !== height - 1) {
      printDivider(state.grid.cells, width, r, block)
    }
  }

  printTail(width, block)
}

let printHead = (grid: Grid, width: number, block: Block) => {
  let chars = ['┌']

  let midChars = Array.from({ length: width }, (_, i) => {
    let num = grid[0]![i]!.number
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
    let num = grid[row + 1]![i]!.number

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
