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

  let [h, s, l] = matches.slice(1).map(x => parseInt(x, 10))

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
