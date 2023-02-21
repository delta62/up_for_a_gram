import { createLogger, format, transports } from 'winston'

let logger = createLogger({
  level: 'debug',
  format: format.json(),
  transports: [new transports.File({ filename: 'combined.log' })],
})

export default logger
