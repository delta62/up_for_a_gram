import { stdout } from 'process'

export let clear = () => {
  stdout.write('\u001B[2J\u001B[0;0f')
}

export let clearToScreenEnd = () => {
  stdout.write('\u001B[0J\u001B[0;0f')
}

export let moveTo = (x: number, y: number) => {
  stdout.write(`\u001B[${y};${x}H`)
}

export let dimensions = () => {
  return {
    height: process.stdout.rows,
    width: process.stdout.columns,
  }
}

export let showCursor = () => {
  stdout.write('\u001B[?25h')
}

export let hideCursor = () => {
  stdout.write('\u001B[?25l')
}
