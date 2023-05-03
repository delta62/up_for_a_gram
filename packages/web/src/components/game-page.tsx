import { useStore } from 'react-redux'
import { ClueNav, Grid } from '@components'
import { useSocket } from '@hooks'
import { gameEventToAction } from '../dfac-mapper'
import { State } from 'store'
import { useParams } from '@delta62/micro-router'
import styles from './game-page.module.scss'
import { useCallback } from 'react'

export let GamePage = () => {
  let params = useParams()
  let store = useStore<State>()

  useSocket(params.gameId!, event => {
    let action = gameEventToAction(event, store.getState())
    store.dispatch(action)
  })

  let onNext = useCallback(() => {
    console.log('move to next clue')
  }, [])

  let onPrev = useCallback(() => {
    console.log('move to next clue')
  }, [])

  return (
    <>
      <section className={styles.grid}>
        <Grid />
      </section>
      <ClueNav className={styles.nav} onNext={onNext} onPrev={onPrev} />
    </>
  )
}
