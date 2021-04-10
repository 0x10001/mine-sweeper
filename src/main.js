import '../css/style.css'
import { randRange } from './Random'

for (let i = 0; i < 10; i++) {
  console.log(randRange(10))
}

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
