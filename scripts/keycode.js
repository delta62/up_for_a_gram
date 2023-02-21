#!/usr/bin/env node

const { strlen } = require('printable-characters')

const CTRL_C_KEY = '\u0003'

new Promise(() => {
  if (!process.stdin.isTTY) {
    console.error('Must be run interactively')
    process.exit(1)
  }

  console.log('press key combinations to see their codes')

  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf-8')

  process.stdin.on('data', key => {
    if (key === CTRL_C_KEY) {
      process.exit()
    }

    let bytes = Buffer.from(key)
    let displayKey = (strlen(key) === 0 ? '?' : key).padStart(4)
    let hex = `0x${bytes.toString('hex')}`
    process.stdout.write(`[key press]: ${displayKey}   ${hex}\n`)
  })
})
