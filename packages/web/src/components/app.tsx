import { ChooseGamePage, GamePage } from '@components'
import styles from './app.module.scss'
import createStore from 'store'
import { Provider } from 'react-redux'
import { RouteProvider, Route } from '@delta62/micro-router'

// Required for socket.io-client for some reason
;(window as any).global = window

let store = createStore()

export let App = () => (
  <RouteProvider>
    <Provider store={store}>
      <div className={styles.app}>
        <Route path="/">
          <ChooseGamePage />
        </Route>
        <Route path="/game/:gameId">
          <GamePage />
        </Route>
      </div>
    </Provider>
  </RouteProvider>
)
