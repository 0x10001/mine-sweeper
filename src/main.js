import '../css/style.css'
import { Board } from './Board'

const secret = new Board()
secret.debug()

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
