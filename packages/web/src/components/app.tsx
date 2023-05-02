import { GamePage } from '@components'
import styles from './app.module.scss'
import createStore from 'store'
import { Provider } from 'react-redux'

let store = createStore()

export let App = () => (
  <Provider store={store}>
    <div className={styles.app}>
      <GamePage gameId="3246210-nund" />
    </div>
  </Provider>
)
