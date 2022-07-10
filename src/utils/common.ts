import { BlockStatus, BlockType } from './const'
import { Board, IBlock } from './types'

export class Block implements IBlock {
  status: BlockStatus
  count: number

  constructor(public type: BlockType) {
    this.type = type
    this.count = 0
    this.status = BlockStatus.Unknown
  }
}

export function generateGameBoard(row: number, col: number, mineCount: number) {
  const board = Array.from({ length: row }, () =>
    Array.from({ length: col }, () => new Block(BlockType.Normal))
  )
  let c = mineCount
  while (c) {
    const x = Math.floor(row * Math.random())
    const y = Math.floor(col * Math.random())
    const blocks = getBlocksAround(board, x, y)
    if (board[x][y].type !== BlockType.Mine) {
      if (blocks.every((b) => b.type === BlockType.Mine)) continue
      board[x][y] = new Block(BlockType.Mine)
      for (const block of blocks) {
        if (block.type === BlockType.Normal) {
          block.count++
        }
      }
      c--
    }
  }
  return board
}

export function getBlocksAround(board: Board, row: number, col: number) {
  const res: Block[] = []
  if (row > 0 && col > 0) res.push(board[row - 1][col - 1])
  if (row > 0) res.push(board[row - 1][col])
  if (row > 0 && col < board[0].length - 1) res.push(board[row - 1][col + 1])
  if (col < board[0].length - 1) res.push(board[row][col + 1])
  if (row < board.length - 1 && col < board[0].length - 1)
    res.push(board[row + 1][col + 1])
  if (row < board.length - 1) res.push(board[row + 1][col])
  if (row < board.length - 1 && col > 0) res.push(board[row + 1][col - 1])
  if (col > 0) res.push(board[row][col - 1])
  return res
}
