class BlockResponse {
  row
  col
  value

  constructor(row, col, value) {
    this.row = row
    this.col = col
    this.value = value
  }
}

export class OperationResponse {
  unflagged
  remainders
  uncovered = []
  affected = []

  constructor(board) {
    this.unflagged = board.unflagged
    this.remainders = board.remainders
  }

  uncover(row, col, value) {
    --this.remainders
    this.uncovered.push(new BlockResponse(row, col, value))
  }

  affect(row, col, value) {
    this.affected.push(new BlockResponse(row, col, value))
  }
}
