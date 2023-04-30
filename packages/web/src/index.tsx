import { createRoot } from 'react-dom/client'
import { App } from '@components'

let rootNode = document.getElementById('root')!
let root = createRoot(rootNode)

root.render(<App />)
