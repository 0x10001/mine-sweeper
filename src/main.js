import '../css/style.css'
import { Board } from './Board'

const secret = new Board()
secret.start(5, 5)
secret.debug()

globalThis.uncover = function (r, c) {
  console.clear()
  const ret = secret.uncover(r, c)
  console.debug(JSON.stringify(ret))
  secret.debug()
}

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
