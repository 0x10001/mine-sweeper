import { randRange } from "./Random"

export class Board {
  // for debug
  debug() {
    const msg = this.#board.map(row => 
      Array.prototype.map.call(row, x => x & Board.#MASK).join('')
    ).join('\n')
    console.debug(msg)
  }

  #secret = new Uint8Array(512)
  #board
  #height
  #width
  #size
  #mines

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

  start(r, c) {
    const neighbors = this.neighbors(r, c)
    neighbors.push([r, c])

    const mineSet = new Set(Array.from({length: this.#mines}, (_, i) => i))

    for (let i = this.#size - neighbors.length; i > 1; i--) {
      const j = randRange(i)
      this.#swap(i - 1, j, mineSet)
    }

    let k = this.#size
    for (const [y, x] of neighbors) {
      this.#swap(this.#pack(y, x), --k, mineSet)
    }

    for (const idx of mineSet) {
      const [sr, sc] = this.#unpack(idx)
      for (const [y, x] of this.neighbors(sr, sc)) {
        this.#board[y][x] & Board.#MASK ^ Board.#MINE && this.#board[y][x]++
      }
    }
  }

  neighbors(r, c) {
    return Board.#neighbors.map(([dr, dc]) => [r + dr, c + dc]).filter(([y, x]) => this.#isInBoard(y, x))
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

  #swap(x, y, s) {
    if ((this.#secret[x] ^ this.#secret[y]) & Board.#MASK) {
      this.#secret[x] ^= this.#secret[y] & Board.#MASK
      this.#secret[y] ^= this.#secret[x] & Board.#MASK
      this.#secret[x] ^= this.#secret[y] & Board.#MASK
      if (this.#secret[x] & Board.#MASK) {
        s.delete(y)
        s.add(x)
      } else {
        s.delete(x)
        s.add(y)
      }
    }
  }
}
