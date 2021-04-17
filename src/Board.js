export class Board {
  #secret = new Uint8Array(512)
  #board
  #height
  #width
  #size
  #mines

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

  get height() {
    return this.#height
  }

  get width() {
    return this.#width
  }

  get mines() {
    return this.#mines
  }
}
