export let zip = <T, U>(xs: T[], ys: U[]): [T, U][] => {
  let min = Math.min(xs.length, ys.length)
  let ret = new Array(min)

  for (let i = 0; i < min; i++) {
    ret.push([xs[i], ys[i]])
  }

  return ret
}
