import '../css/style.css'
import './Drawing'
import { Board } from './Board'

const secret = new Board()

const buf = new Uint8Array(512)
buf.fill(Board.INIT)

const board = Array.from({length: secret.height}, (_, i) => buf.subarray(i * secret.width, (i + 1) * secret.width))

function showBoard() {
  const msg = board.map(row => 
    (Array.prototype.map.call(row, x => 
      x === Board.INIT ? '?' :
      x === Board.FLAG ? '!' :
      x === Board.EXPLODED ? ':' :
      x === Board.MINE ? '.' :
      x === Board.CROSS ? 'X' :
      x === Board.HIDDEN ? '@' :
      x === 0 ? ' ' :
      x).join(''))
  ).join('\n')
  console.debug(msg)
}

globalThis.uncover = function(r, c) {
  console.clear()
  const ret = secret.handle(r, c)

  for (const {row, col, value} of ret.uncovered) {
    board[row][col] = value
  }
  for (const {row, col, value} of ret.affected) {
    board[row][col] = value
  }
  console.debug(ret.unflagged, ret.remainders)
  showBoard()
}

globalThis.toggleFlag = function (r, c) {
  console.clear()
  const ret = secret.toggleFlag(r, c)

  for (const {row, col, value} of ret.affected) {
    board[row][col] = value
  }
  console.debug(ret.unflagged, ret.remainders)
  showBoard()
}
