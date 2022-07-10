import { atom } from 'recoil'
import { GameStatus } from '../utils/const'

export const gameStatusState = atom({
  key: 'gameStatusState',
  default: GameStatus.Start
})

export const rowCountState = atom({
  key: 'rowCountState',
  default: 16
})

export const colCountState = atom({
  key: 'colCountState',
  default: 16
})

export const mineCountState = atom({
  key: 'mineCountState',
  default: 50
})
