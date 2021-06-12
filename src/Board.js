import { randRange } from './Random'
import { OperationResponse } from './Response'

export class Board {
  // for debug
  debug() {
    const msg = this.#board.map(row => 
      Array.prototype.map.call(row, x => x & Board.#MASK).map(x => x === 0 ? ' ' : x === Board.#MINE ? '.' : x).join('')
    ).join('\n')
    console.debug(msg)
  }

  #secret = new Uint8Array(512)
  #board
  #height
  #width
  #size
  #mines
  #unflagged
  #remainders
  #over

  static get INIT() { return 9 }
  static get FLAG() { return 10 }
  static get CROSS() { return 11 }
  static get MINE() { return 12 }
  static get EXPLODED() { return 13 }
  static get HIDDEN() { return 14 }

  static #MINE = 0x0f
  static #UNCOVERED = 0x10
  static #FLAGGED = 0x20
  static #MASK = 0x0f

  static #neighbors = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ]

  constructor() {
    this.resize(16, 30, 99)
  }

  resize(height, width, mines) {
    this.#size = height * width
    this.#height = height
    this.#width = width
    this.#mines = mines
    this.#board = Array.from({length: height}, (_, i) => this.#secret.subarray(i * width, (i + 1) * width))
    this.reset()
  }

  reset() {
    this.#over = false
    this.#unflagged = this.#mines
    this.#remainders = this.#size - this.#mines
    this.#secret.fill(0, 0, this.#size)
  }

  neighbors(r, c) {
    return Board.#neighbors.map(([dr, dc]) => [r + dr, c + dc]).filter(([y, x]) => this.#isInBoard(y, x))
  }

  toggleFlag(r, c) {
    // already uncovered
    if (this.#over || this.#board[r][c] & Board.#UNCOVERED) {
      return new OperationResponse(this)
    }

    // flagged
    if (this.#board[r][c] & Board.#FLAGGED) {
      this.#board[r][c] &= ~Board.#FLAGGED
      ++this.#unflagged
      const ret = new OperationResponse(this)
      ret.affect(r, c, Board.INIT)
      return ret
    }

    // unhandled
    this.#board[r][c] |= Board.#FLAGGED
    --this.#unflagged
    const ret = new OperationResponse(this)
    ret.affect(r, c, Board.FLAG)
    return ret
  }

  handle(r, c) {
    if (this.#over || this.#board[r][c] & Board.#FLAGGED) {
      return new OperationResponse(this)
    }

    if (this.#board[r][c] & Board.#UNCOVERED) {
      const neighbors = this.neighbors(r, c)
      const flags = neighbors.reduce((r, [y, x]) => r + ((this.#board[y][x] | Board.#FLAGGED) > 0), 0)
      return flags === (this.#board[r][c] & Board.#MASK) ? this.#uncover(neighbors) : new OperationResponse(this)
    }

    if (this.#size === this.#mines + this.#remainders) {
      this.#start(r, c)
    }
    return this.#uncover([[r, c]])
  }

  get height() {
    return this.#height
  }

  get width() {
    return this.#width
  }

  get mines() {
    return this.#mines
  }

  get unflagged() {
    return this.#unflagged
  }

  get remainders() {
    return this.#remainders
  }

  static #isInRange(n, b) {
    return n >= 0 && n < b
  }

  #isInBoard(r, c) {
    return Board.#isInRange(c, this.#width) && Board.#isInRange(r, this.#height)
  }

  #pack(r, c) {
    return r * this.#width + c
  }

  #unpack(index) {
    const c = index % this.#width
    const r = (index - c) / this.#width
    return [r, c]
  }

  #start(r, c) {
    const neighbors = new Set(this.neighbors(r, c).map(([y, x]) => this.#pack(y, x)))
    neighbors.add(this.#pack(r, c))

    const pool = Uint16Array.from({length: this.#size}, (_, i) => i)
    const mineSet = new Set()

    for (let i = this.#size; mineSet.size < this.#mines; i--) {
      const j = randRange(i)
      const t = pool[j]
      pool[j] = pool[i - 1]
      if (neighbors.has(t)) {
        continue
      }
      mineSet.add(t)
      this.#secret[t] |= Board.#MINE
    }

    for (const idx of mineSet) {
      const [sr, sc] = this.#unpack(idx)
      for (const [y, x] of this.neighbors(sr, sc)) {
        this.#board[y][x] & Board.#MASK ^ Board.#MINE && this.#board[y][x]++
      }
    }
  }

  #uncover(blocks) {
    const mask = Board.#FLAGGED | Board.#UNCOVERED
    const ret = new OperationResponse(this)
    const queue = new Set(blocks.filter(([r, c]) => !(this.#board[r][c] & mask)).map(([r, c]) => this.#pack(r, c)))
    let exploded = false
    while (queue.size) {
      const index = queue.keys().next().value
      queue.delete(index)
      const [dr, dc] = this.#unpack(index)
      if (this.#board[dr][dc] === Board.#MINE) {
        exploded = true
        this.#board[dr][dc] |= Board.#UNCOVERED
        ret.affect(dr, dc, Board.EXPLODED)
        continue
      }
      if (this.#board[dr][dc] === 0) {
        for (let [y, x] of this.neighbors(dr, dc)) {
          this.#board[y][x] & mask || queue.add(this.#pack(y, x))
        }
      }
      --this.#remainders
      ret.uncover(dr, dc, this.#board[dr][dc])
      this.#board[dr][dc] |= Board.#UNCOVERED
    }

    // game over
    if (exploded) {
      this.#over = true
      const correctFlag = Board.#FLAGGED | Board.#MINE
      for (let r = 0; r < this.#height; r++) {
        for (let c = 0; c < this.#width; c++) {
          if (this.#board[r][c] & Board.#UNCOVERED || this.#board[r][c] === correctFlag) {
            continue
          }
          if (this.#board[r][c] === Board.#MINE) {
            ret.affect(r, c, Board.MINE)
          } else if (this.#board[r][c] & Board.#FLAGGED) {
            ret.affect(r, c, Board.CROSS)
          }
        }
      }
    } else if (this.#remainders === 0) {
      this.#over = true
      for (let r = 0; r < this.#height; r++) {
        for (let c = 0; c < this.#width; c++) {
          if (this.#board[r][c] === Board.#MINE) {
            ret.affect(r, c, Board.HIDDEN)
          }
        }
      }
    }

    return ret
  }
}
