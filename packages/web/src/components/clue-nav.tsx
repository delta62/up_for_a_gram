import styles from './clue-nav.module.scss'

export type Direction = 'across' | 'down'

export interface Props {
  className?: string
  clue: string
  num: number
  direction: Direction
  onNext(): void
  onPrev(): void
}

export let ClueNav = (props: Props) => (
  <nav className={`${styles.clueNav} ${props.className}`}>
    <i className={styles.arrowLeft} onClick={props.onPrev}></i>
    <i className={styles.arrowRight} onClick={props.onNext}></i>
    <span className={styles.location}>
      <span>{props.num}</span>
      <span>{props.direction.substring(0, 1)}</span>
    </span>
    <span className={styles.clue}>{props.clue}</span>
  </nav>
)
