import { ClueNav, Grid } from '@components'
import styles from './app.module.scss'

let onNext = () => {
  console.log('next clue')
}

let onPrev = () => {
  console.log('prev clue')
}

export let App = () => (
  <div className={styles.app}>
    <section className={styles.grid}>
      <Grid />
    </section>
    <ClueNav
      className={styles.nav}
      onNext={onNext}
      onPrev={onPrev}
      direction="down"
      num={42}
      clue="Young Spitter-upper"
    />
  </div>
)
