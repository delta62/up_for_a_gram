import { GridState, RenderCellFlags } from 'store'

const CELL_SIZE = 40
const NUM_MARGIN = 3

export let clear = (ctx: CanvasRenderingContext2D) => {
  ctx.save()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.restore()
}

export let render = (canvas: HTMLCanvasElement, state: GridState) => {
  let ctx = canvas.getContext('2d')
  if (!ctx || state.length === 0) return

  clear(ctx)
  ctx.strokeStyle = '#aaa'

  let width = state[0]!.length
  let height = state.length

  for (let row = 0; row < height; row++) {
    let y = CELL_SIZE * row

    for (let col = 0; col < width; col++) {
      let x = CELL_SIZE * col
      let cell = state[row]![col]!

      if (cell.flags & RenderCellFlags.Black) {
        ctx.fillStyle = '#000'
      } else if (cell.flags & RenderCellFlags.Selected) {
        ctx.fillStyle = '#dde'
      } else if (cell.flags & RenderCellFlags.SelectedWord) {
        ctx.fillStyle = '#eee'
      } else {
        ctx.fillStyle = '#fff'
      }

      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)

      if (cell.num) {
        ctx.fillStyle = '#000'
        ctx.textBaseline = 'top'
        ctx.font = '56% Arial'
        ctx.fillText(`${cell.num}`, x + NUM_MARGIN, y + NUM_MARGIN)
      }

      if (cell.value) {
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#000'
        ctx.font = '100% Arial'

        let { width: textWidth } = ctx.measureText(cell.value)
        let textX = x + CELL_SIZE / 2 - textWidth / 2
        let textY = y + CELL_SIZE / 2

        ctx.fillText(cell.value, textX, textY)
      }
    }
  }
}

export let zoom = (ctx: CanvasRenderingContext2D, amount: number) => {
  let t = ctx.getTransform()
  let currentScale = t.a
  let newScale

  if (amount > 0) {
    newScale = Math.min(+2.0, currentScale + 0.1)
  } else {
    newScale = Math.max(0.5, currentScale - 0.1)
  }

  let newTransform = new DOMMatrix([newScale, t.b, t.c, newScale, t.e, t.f])
  ctx.setTransform(newTransform)
}

export let coordsToCell = (ctx: CanvasRenderingContext2D, point: DOMPoint) => {
  let transform = ctx.getTransform().inverse()
  let p = transform.transformPoint(point)
  let x = Math.floor(p.x / CELL_SIZE)
  let y = Math.floor(p.y / CELL_SIZE)

  return { x, y }
}
