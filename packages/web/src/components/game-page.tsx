import { useStore } from 'react-redux'
import { ClueNav, Grid } from '@components'
import { useSocket } from '@hooks'
import { gameEventToAction } from '../dfac-mapper'
import { State } from 'store'
import styles from './game-page.module.scss'

export interface Props {
  gameId: string
}

let nop = () => {}

export let GamePage = ({ gameId }: Props) => {
  useSocket(gameId, event => {
    let store = useStore<State>()
    let action = gameEventToAction(event, store.getState())
    store.dispatch(action)
  })

  return (
    <>
      <section className={styles.grid}>
        <Grid />
      </section>
      <ClueNav
        className={styles.nav}
        onNext={nop}
        onPrev={nop}
        direction="down"
        num={42}
        clue="Young Spitter-upper"
      />
    </>
  )
}
