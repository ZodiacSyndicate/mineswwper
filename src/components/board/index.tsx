import { useEffect, useState, useRef } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import cx from 'classnames'
import {
  boardState,
  gameStatus,
  mineCountState,
  gameStatusState
} from '@/store'
import {
  deepCopyBoard,
  generateGameBoard,
  getBlockClassName,
  getBlocksAround
} from '@/utils/common'
import { BlockStatus, BlockType, GameStatus, MouseButton } from '@/utils/const'
import { IBoard, IBlock } from '@/utils/types'
import './index.scss'

const knownClassNames = ['known-light', 'known-dark']
const unknownClassNames = ['unknown-light', 'unknown-dark']

const Board = () => {
  const [board, setGameBoard] = useRecoilState(boardState)
  const game = useRecoilValue(gameStatus)
  const setMineCount = useSetRecoilState(mineCountState)
  const setGameStatus = useSetRecoilState(gameStatusState)
  const onMouseDown = useRef(false)
  const mouseButton = useRef(MouseButton.None)
  const [hilightedBlocks, setHilightedBlocks] = useState<Set<string>>(new Set())

  const generateGame = () => {
    setGameBoard(generateGameBoard(game.row, game.col, game.mine))
  }

  useEffect(() => {
    generateGame()
  }, [])

  const handleClickZeroBlock = (
    board: IBoard,
    block: IBlock,
    row: number,
    col: number
  ) => {
    if (block.status !== BlockStatus.Unknown) return
    if (block.type === BlockType.Mine) return
    board[row][col] = { ...block, status: BlockStatus.Known }
    if (block.count > 0) return
    const aroundBlocks = getBlocksAround(board, row, col)
    aroundBlocks.forEach((item) => {
      handleClickZeroBlock(board, item.block, item.row, item.col)
    })
  }

  const handleLeftMounseUp = (block: IBlock, row: number, col: number) => {
    if (block.status !== BlockStatus.Unknown) return
    const newBoard = deepCopyBoard(board)
    if (block.type === BlockType.Normal) {
      if (block.count > 0) {
        newBoard[row][col] = {
          ...block,
          status: BlockStatus.Known
        }
      } else {
        handleClickZeroBlock(newBoard, block, row, col)
      }
      setGameBoard(newBoard)
    } else {
      setGameStatus(GameStatus.Lose)
    }
  }

  const handleRightMouseUp = (block: IBlock, row: number, col: number) => {
    if (block.status === BlockStatus.Known) return
    switch (block.status) {
      case BlockStatus.Marked:
        setMineCount((count) => count + 1)
        break
      case BlockStatus.Unknown:
        setMineCount((count) => count - 1)
        break
      default:
        break
    }
    setGameBoard((board) => {
      const newBoard = deepCopyBoard(board)
      switch (block.status) {
        case BlockStatus.Known:
          break
        case BlockStatus.Marked:
          newBoard[row][col] = { ...block, status: BlockStatus.Questionmarked }
          break
        case BlockStatus.Questionmarked:
          newBoard[row][col] = { ...block, status: BlockStatus.Unknown }
          break
        case BlockStatus.Unknown:
          newBoard[row][col] = { ...block, status: BlockStatus.Marked }
          break
      }
      return newBoard
    })
  }

  const handleBothMouseUp = (block: IBlock, row: number, col: number) => {
    setGameBoard((board) => {
      const newBoard = deepCopyBoard(board)
      const blocksAround = getBlocksAround(newBoard, row, col)
      let count = 0
      for (const b of blocksAround) {
        if (
          b.block.type === BlockType.Mine &&
          b.block.status === BlockStatus.Marked
        ) {
          count++
        }
      }
      if (count === block.count) {
        blocksAround.forEach((b) => {
          if (
            b.block.type !== BlockType.Mine &&
            b.block.status === BlockStatus.Unknown
          ) {
            if (b.block.count === 0) {
              handleClickZeroBlock(newBoard, b.block, b.row, b.col)
            }
            newBoard[b.row][b.col] = {
              ...b.block,
              status: BlockStatus.Known
            }
          }
        })
      }
      return newBoard
    })
  }

  const handleMouseUp = (block: IBlock, row: number, col: number) => {
    switch (mouseButton.current) {
      case MouseButton.Left:
        handleLeftMounseUp(block, row, col)
        break
      case MouseButton.Right:
        handleRightMouseUp(block, row, col)
        break
      case MouseButton.Both:
        handleBothMouseUp(block, row, col)
        break
    }
    mouseButton.current = MouseButton.None
    onMouseDown.current = false
    setHilightedBlocks(new Set())
  }

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    block: IBlock,
    row: number,
    col: number
  ) => {
    if (game.gameStatus !== GameStatus.Start) return
    mouseButton.current = e.buttons
    onMouseDown.current = true
    switch (e.buttons) {
      case MouseButton.Left:
        if (block.status === BlockStatus.Unknown) {
          setHilightedBlocks(new Set([`${row}_${col}`]))
        }
      case MouseButton.Both:
        if (block.status === BlockStatus.Known) {
          setHilightedBlocks(
            new Set(
              getBlocksAround(board, row, col).map((b) => `${b.row}_${b.col}`)
            )
          )
        }
    }
  }

  return (
    <div className="board">
      {board.map((row, i) => (
        <div key={i} className="row">
          {row.map((block, j) => (
            <div
              key={j}
              className={cx(
                'block',
                getBlockClassName(block, i, j, hilightedBlocks)
              )}
              onMouseDown={(e) => handleMouseDown(e, block, i, j)}
              onMouseUp={() => handleMouseUp(block, i, j)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {block.status === BlockStatus.Unknown && null}
              {block.status === BlockStatus.Known &&
                (block.type === BlockType.Mine
                  ? 'X'
                  : block.count
                  ? block.count
                  : '')}
              {block.status === BlockStatus.Questionmarked && '❔'}
              {block.status === BlockStatus.Marked && '🚩'}
            </div>
          ))}
        </div>
      ))}
      <div>{game.mine}</div>
    </div>
  )
}

export default Board
