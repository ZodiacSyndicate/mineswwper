import { BlockStatus, BlockType } from './const'

export interface IBlock {
  type: BlockType
  status: BlockStatus
  count: number
}

export type Board = Block[][]
