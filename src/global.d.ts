declare module 'socket.io-client'

declare module 'printable-characters' {
  let ansiExcapeCodes: RegExp
  let zeroWidthCharacters: RegExp

  function blank(s: string): string
  function first(s: string, n: number): string
  function isBlank(s: string): boolean
  function partition(s: string): [string, string][]
  function strlen(s: string): number
}
