// import { Game } from './game-state'
// import { yellow, green } from 'chalk'
// import { clear, hideCursor } from './term'
// import { Block, block, render as uiRender, writeLine } from './ui'
//
// let render = (game: Game) => {
//   clear()
//   hideCursor()
//
//   let header = block({ valign: 'start', halign: 'middle' })
//   writeLine(game.info.title.trim(), header)
//   writeLine(game.info.author.trim(), header)
//   uiRender(header)
//
//   let mode = game.mode
//   let { r, c } = game.selection
//   let clue = game.grid[r][c].parents?.[mode]
//   let clueText = clue ? game.clues[mode][clue]! : ''
//
//   if (clueText) {
//     let displayText = `${clue} ${mode.toUpperCase()}: ${clueText}`
//     let footer = block({ valign: 'end', halign: 'middle' })
//     writeLine(displayText, footer)
//     uiRender(footer)
//   }
//
//   let puzzle = block({ valign: 'middle', halign: 'middle' })
//   renderPuzzle(game, puzzle)
//   uiRender(puzzle)
// }
//
// let renderPuzzle = (game: Game, block: Block) => {
//   let width = game.grid[0].length
//   let height = game.grid.length
//
//   printHead(game, width, block)
//
//   for (let r = 0; r < height; r++) {
//     let row = game.grid[r]
//     let output = ['│']
//
//     for (let c in row) {
//       let selected = game.selection.r === r && game.selection.c === parseInt(c)
//       let cell = row[c]
//       if (cell.black) {
//         output.push('███')
//       } else {
//         if (selected) {
//           output.push(` ${yellow.underline(cell.value || ' ')} `)
//         } else {
//           output.push(` ${cell.value || ' '}`)
//
//           let someoneElseSelected = Object.values(game.players).find(
//             p => r === p.position.r && parseInt(c) === p.position.c
//           )
//
//           if (someoneElseSelected) {
//             output.push(`${green('*')}`)
//           } else {
//             output.push(' ')
//           }
//         }
//       }
//
//       output.push('│')
//     }
//
//     writeLine(output.join(''), block)
//
//     if (r !== height - 1) {
//       printDivider(game, width, r, block)
//     }
//   }
//
//   printTail(width, block)
// }
//
// let printHead = (game: Game, width: number, block: Block) => {
//   let chars = ['┌']
//
//   let midChars = Array.from({ length: width }, (_, i) => {
//     let num = game.grid[0][i].number
//     let cellNum = numberToSubscript(num, 3, '─')
//
//     if (i === width - 1) {
//       return cellNum
//     } else {
//       return `${cellNum}┬`
//     }
//   })
//
//   chars = chars.concat(midChars).concat('┐')
//
//   writeLine(chars.join(''), block)
// }
//
// let printTail = (width: number, block: Block) => {
//   let chars = ['└']
//
//   let midChars = Array.from({ length: width }, (_, i) => {
//     if (i === width - 1) {
//       return '───'
//     } else {
//       return '───┴'
//     }
//   })
//
//   chars = chars.concat(midChars).concat('┘')
//
//   writeLine(chars.join(''), block)
// }
//
// let printDivider = (game: Game, width: number, row: number, block: Block) => {
//   let chars = ['├']
//   let midChars = Array.from({ length: width }, (_, i) => {
//     let num = game.grid[row + 1][i].number
//
//     if (i === width - 1) {
//       return numberToSubscript(num, 3, '─')
//     } else {
//       return `${numberToSubscript(num, 3, '─')}┼`
//     }
//   })
//
//   chars = chars.concat(midChars).concat('┤')
//
//   writeLine(chars.join(''), block)
// }
//
// let numberToSubscript = (
//   n: number | null,
//   length: number,
//   pad: string
// ): string => {
//   if (n == null) {
//     return Array.from<string>({ length }).fill(pad).join('')
//   }
//
//   let chars = []
//   let s = `${n}`
//
//   for (let i = 0; i < s.length; i++) {
//     chars.push(String.fromCharCode(s.charCodeAt(i) + 0x2050))
//   }
//
//   while (chars.length < length) {
//     chars.push(pad)
//   }
//
//   return chars.join('')
// }
//
// export default render
