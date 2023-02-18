import { CellRef, Game } from './game-state'
import { yellow } from 'chalk'

let render = (game: Game) => {
  process.stdout.write('\u001B[2J\u001B[0;0f')

  let width = game.grid[0].length
  let height = game.grid.length

  console.log(center(game.info.title, width))
  console.log(center(game.info.author, width))

  printHead(width, game.selection)

  for (let r = 0; r < height; r++) {
    let row = game.grid[r]
    let selected = game.selection.r === r && game.selection.c === 0

    let output = []
    if (selected) {
      output.push('┃')
    } else {
      output.push('│')
    }

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

      selected = game.selection.r === r && game.selection.c === parseInt(c)
      if (selected) {
        output.push('┃')
      } else {
        output.push('│')
      }
    }

    console.log(output.join(' '))

    if (r !== height - 1) {
      printDivider(width, r, game.selection)
    }
  }

  printTail(width, height, game.selection)
}

let printHead = (width: number, selection: CellRef) => {
  let selected = selection.c === 0 && selection.r === 0
  let chars = []

  if (selected) {
    chars.push('┏')
  } else {
    chars.push('┌')
  }

  let midChars = Array.from({ length: width }, (_, i) => {
    selected = selection.r === 0 && selection.c === i
    if (selected) {
      if (i === width - 1) {
        return '━━━'
      } else {
        return '━━━┳'
      }
    } else {
      if (i === width - 1) {
        return '───'
      } else {
        return '───┬'
      }
    }
  })

  selected = selection.r === 0 && selection.c === width
  if (selected) {
    chars = chars.concat(midChars).concat('┓')
  } else {
    chars = chars.concat(midChars).concat('┐')
  }

  console.log(chars.join(''))
}

let printTail = (width: number, height: number, selection: CellRef) => {
  let selected = selection.c === 0 && selection.r === height
  let chars = []

  if (selected) {
    chars.push('┗')
  } else {
    chars.push('└')
  }

  let midChars = Array.from({ length: width }, (_, i) => {
    let selected = selection.r === height && selection.c === i
    if (selected) {
      if (i === width - 1) {
        return '━━━'
      } else {
        return '━━━┻'
      }
    } else {
      if (i === width - 1) {
        return '───'
      } else {
        return '───┴'
      }
    }
  })

  selected = selection.r === height && selection.c === width
  if (selected) {
    chars = chars.concat(midChars).concat('┛')
  } else {
    chars = chars.concat(midChars).concat('┘')
  }

  console.log(chars.join(''))
}

let printDivider = (width: number, r: number, selection: CellRef) => {
  let selected = selection.r === r && selection.c === 0

  let chars = []

  if (selected) {
    chars.push('┣')
  } else {
    chars.push('├')
  }

  let midChars = Array.from({ length: width }, (_, i) => {
    selected = selection.r === r && i === selection.c
    if (selected) {
      if (i === width - 1) {
        return '━━━'
      } else {
        return '━━━╋'
      }
    } else {
      if (i === width - 1) {
        return '───'
      } else {
        return '───┼'
      }
    }
  })

  selected = selection.r === r && selection.c === width - 1
  if (selected) {
    chars = chars.concat(midChars).concat('┫')
  } else {
    chars = chars.concat(midChars).concat('┤')
  }

  console.log(chars.join(''))
}

let center = (text: string, width: number): string => {
  let gridWidth = width * 4 - 1
  let textWidth = text.length
  let padWidth = (gridWidth - textWidth) / 2
  return text.padStart(padWidth + textWidth)
}

export default render
