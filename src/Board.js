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
}
