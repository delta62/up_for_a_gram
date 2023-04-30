declare module 'socket.io-client' {
  export type Transport = 'websocket'

  interface ClientOptions {
    upgrade: boolean
    transports: Transport[]
  }

  export interface Client {
    on(event: string, callback: (...args: any[]) => void): void
    emit(...args: any[], callback?: (...args: any[]) => void): void
    connect(): void
  }

  function Client(host: string, options: ClientOptions): Client

  export default Client
}

declare module 'printable-characters' {
  let ansiExcapeCodes: RegExp
  let zeroWidthCharacters: RegExp

  function blank(s: string): string
  function first(s: string, n: number): string
  function isBlank(s: string): boolean
  function partition(s: string): [string, string][]
  function strlen(s: string): number
}
