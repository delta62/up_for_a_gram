export type Grid = GridRow[]

export type GridRow = GridCell[]

export type SolutionRow = string[]

export interface GameInfo {
  title: string
  author: string
}

export interface Parents {
  across: number
  down: number
}

export interface GridCell {
  black: boolean
  value: string
  number: number | null
  parents?: Parents
}

export interface Clues {
  across: (string | null)[]
  down: (string | null)[]
}

export interface WsGame {
  circles: unknown
  clues: Clues
  grid: Grid
  info: GameInfo
  solution: SolutionRow[]
}

export type InputMode = 'down' | 'across'

export interface Player {
  id: string
  name: string
  position: CellRef
  color: string
}

export interface Game extends WsGame {
  selection: CellRef
  mode: InputMode
  players: Record<string, Player>
}

export interface CellRef {
  r: number
  c: number
}

export interface UpdateCellParams {
  cell: CellRef
  value: string
}

export interface UpdateCursorParams {
  cell: CellRef
  id: string
}

export interface UpdateDisplayNameParams {
  id: string
  displayName: string
}

export interface UpdateColorParams {
  id: string
  color: string
}

export interface CheckEventParams {
  scope: CellRef[]
}

export interface CreateEvent {
  type: 'create'
  params: { game: WsGame }
}

export interface UpdateCellEvent {
  type: 'updateCell'
  params: UpdateCellParams
}

export interface UpdateColorEvent {
  type: 'updateColor'
  params: UpdateColorParams
}

export interface UpdateDisplayNameEvent {
  type: 'updateDisplayName'
  params: UpdateDisplayNameParams
}

export interface UpdateCursorEvent {
  type: 'updateCursor'
  params: UpdateCursorParams
}

export interface CheckEvent {
  type: 'check'
  params: CheckEventParams
}

export interface RevealEvent {
  type: 'reveal'
  params: CheckEventParams
}

export type GameEvent =
  | CreateEvent
  | UpdateCellEvent
  | RevealEvent
  | CheckEvent
  | UpdateCursorEvent
  | UpdateDisplayNameEvent
  | UpdateColorEvent

export interface SetCellParams {
  cell: CellRef
  value: string
  color: string
  pencil: false
  id: string
}

export interface SendableProps {
  timestamp: unknown
  id: string
}

export interface SetCellEvent {
  type: 'updateCell'
  params: SetCellParams
}

export interface SendableGameEvent {
  event: (SetCellEvent | CheckEvent | RevealEvent) & SendableProps
  gid: string
}

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface Hsl {
  h: number
  s: number
  l: number
}

const HSL_PATTERN = /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/

export const DEFAULT_COLOR: Hsl = { h: 146, s: 40, l: 60 }

export let parseHsl = (str: string): Hsl | null => {
  let matches = str.match(HSL_PATTERN)
  if (!matches) return null

  let [h, s, l] = matches.slice(1).map(x => parseInt(x, 10)) as [
    number,
    number,
    number
  ]

  return { h, s, l }
}

export let hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  l /= 100

  let a = (s * Math.min(l, 1 - l)) / 100

  let extractComponent = (n: number) => {
    let k = (n + h / 30) % 12
    let color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
  }

  return {
    r: extractComponent(0),
    g: extractComponent(8),
    b: extractComponent(4),
  }
}

export { connect, emit } from './socket'
