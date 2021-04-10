class Level {
  #height
  #width
  #mines
  #size
  remainder

  constructor(height, width, mines) {
    this.#height = height
    this.#width = width
    this.#mines = mines
    this.#size = height * width
    this.remainder = this.#size - this.#mines
  }

  get height() {
    return this.#height
  }

  get width() {
    return this.#width
  }

  get size() {
    return this.#size
  }

  get mines() {
    return this.#mines
  }

  get remainder() {
    return this.remainder
  }
}

export const easy = new Level(10, 10, 10)
export const medium = new Level(16, 16, 40)
export const hard = new Level(16, 30, 99)
