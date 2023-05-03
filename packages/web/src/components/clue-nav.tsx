import { useSelector } from 'react-redux'
import { getCurrentClue } from 'store'
import styles from './clue-nav.module.scss'

export interface Props {
  className?: string
  onNext(): void
  onPrev(): void
}

export let ClueNav = (props: Props) => {
  let clue = useSelector(getCurrentClue)

  return (
    <nav className={`${styles.clueNav} ${props.className}`}>
      <i className={styles.arrowLeft} onClick={props.onPrev}></i>
      <i className={styles.arrowRight} onClick={props.onNext}></i>
      <span className={styles.location}>
        <span>
          {clue?.number ?? ''}
          {clue?.direction?.substring(0, 1) ?? ''}
        </span>
      </span>
      <span className={styles.clue}>{clue?.text ?? ''}</span>
    </nav>
  )
}
