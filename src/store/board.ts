import { atom } from 'recoil'
import { generateGameBoard } from '../utils/common'
import type { Board } from '../utils/types'

export const BoardState = atom<Board>({
  key: 'boardState',
  default: []
})
