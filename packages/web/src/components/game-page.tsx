import { useStore } from 'react-redux'
import { ClueNav, Grid } from '@components'
import { useSocket } from '@hooks'
import { gameEventToAction } from '../dfac-mapper'
import { State } from 'store'
import { useParams } from '@delta62/micro-router'
import styles from './game-page.module.scss'

let nop = () => {}

export let GamePage = () => {
  let params = useParams()
  let store = useStore<State>()

  useSocket(params.gameId!, event => {
    console.log('event', event)
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
