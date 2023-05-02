import { createRoot } from 'react-dom/client'
import { App } from '@components'

if (!PRODUCTION) {
  // Live reload for dev environments. This is compiled out of prod builds.
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload()
  )
}

// Required for socket.io-client for some reason
;(window as any).global = window

let rootNode = document.getElementById('root')!
let root = createRoot(rootNode)

root.render(<App />)
