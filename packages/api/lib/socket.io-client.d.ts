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
    close(): void
    disconnect(): void
  }

  function Client(host: string, options: ClientOptions): Client

  export default Client
}
