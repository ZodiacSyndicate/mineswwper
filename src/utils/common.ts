import {
  BlockStatus,
  BlockType,
  unknownClassNames,
  knownClassNames
} from './const'
import { IBoard, IBlock } from './types'

export class Block implements IBlock {
  public status: BlockStatus
  public count: number

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
    const blocks = getBlocksAround(board, x, y).map((item) => item.block)
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

function generateBlockInfo(block: Block, row: number, col: number) {
  return { block, row, col }
}

export function getBlocksAround(board: IBoard, row: number, col: number) {
  const res: { block: Block; row: number; col: number }[] = []
  if (row > 0 && col > 0)
    res.push(generateBlockInfo(board[row - 1][col - 1], row - 1, col - 1))
  if (row > 0) res.push(generateBlockInfo(board[row - 1][col], row - 1, col))
  if (row > 0 && col < board[0].length - 1)
    res.push(generateBlockInfo(board[row - 1][col + 1], row - 1, col + 1))
  if (col < board[0].length - 1)
    res.push(generateBlockInfo(board[row][col + 1], row, col + 1))
  if (row < board.length - 1 && col < board[0].length - 1)
    res.push(generateBlockInfo(board[row + 1][col + 1], row + 1, col + 1))
  if (row < board.length - 1)
    res.push(generateBlockInfo(board[row + 1][col], row + 1, col))
  if (row < board.length - 1 && col > 0)
    res.push(generateBlockInfo(board[row + 1][col - 1], row + 1, col - 1))
  if (col > 0) res.push(generateBlockInfo(board[row][col - 1], row, col - 1))
  return res
}

export function deepCopyBoard(board: IBoard) {
  return board.map((row) => row.slice())
}

export function getBlockClassName(
  block: IBlock,
  row: number,
  col: number,
  highlightedBlocks: Set<string>
) {
  const index = (row + col) % 2
  if (block.status === BlockStatus.Known) return knownClassNames[index]
  if (block.status === BlockStatus.Unknown) {
    let name = unknownClassNames[index]
    if (highlightedBlocks.has(`${row}_${col}`)) {
      name = `${name}-highlighted`
    }
    return name
  }
  return unknownClassNames[index]
}
