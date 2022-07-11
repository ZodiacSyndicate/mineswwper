import { useEffect } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import cx from "classnames";
import debounce from "lodash.debounce";
import { boardState, gameStatus } from "@/store";
import {
  deepCopyBoard,
  generateGameBoard,
  getBlocksAround,
} from "@/utils/common";
import { BlockStatus, BlockType } from "@/utils/const";
import { IBoard, IBlock } from "@/utils/types";
import "./index.scss";

const knownClassNames = ["known-light", "known-dark"];
const unknownClassNames = ["unknown-light", "unknown-dark"];

const Board = () => {
  const [board, setGameBoard] = useRecoilState(boardState);
  const game = useRecoilValue(gameStatus);

  const generateGame = () => {
    setGameBoard(generateGameBoard(game.row, game.col, game.mine));
  };

  useEffect(() => {
    generateGame();
  }, []);

  const handleClickZeroBlock = (
    board: IBoard,
    block: IBlock,
    row: number,
    col: number
  ) => {
    if (block.status !== BlockStatus.Unknown) return;
    if (block.type === BlockType.Mine) return;
    board[row][col] = { ...block, status: BlockStatus.Known };
    if (block.count > 0) return;
    const aroundBlocks = getBlocksAround(board, row, col);
    aroundBlocks.forEach((item) => {
      handleClickZeroBlock(board, item.block, item.row, item.col);
    });
  };

  const handleLeftMounseDown = (block: IBlock, row: number, col: number) => {
    setGameBoard((board) => {
      const newBoard = deepCopyBoard(board);
      if (block.type === BlockType.Normal) {
        if (block.count > 0) {
          newBoard[row][col] = {
            ...block,
            status: BlockStatus.Known,
          };
        } else {
          handleClickZeroBlock(newBoard, block, row, col);
        }
      }
      return newBoard;
    });
  };

  const handleRightMouseDown = (block: IBlock, row: number, col: number) => {
    setGameBoard((board) => {
      const newBoard = deepCopyBoard(board);
      switch (block.status) {
        case BlockStatus.Known:
          break;
        case BlockStatus.Marked:
          newBoard[row][col] = { ...block, status: BlockStatus.Questionmarked };
          break;
        case BlockStatus.Questionmarked:
          newBoard[row][col] = { ...block, status: BlockStatus.Unknown };
          break;
        case BlockStatus.Unknown:
          newBoard[row][col] = { ...block, status: BlockStatus.Marked };
          break;
      }
      return newBoard;
    });
  };

  const handleBothMouseDown = (block: IBlock, row: number, col: number) => {
    if (block.status !== BlockStatus.Known) return;
  };

  const handleMouseDown = debounce(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      block: IBlock,
      row: number,
      col: number
    ) => {
      switch (e.buttons) {
        case 1:
          handleLeftMounseDown(block, row, col);
          break;
        case 2:
          handleRightMouseDown(block, row, col);
          break;
        case 3:
          handleBothMouseDown(block, row, col);
          break;
      }
    },
    75,
    { trailing: true }
  );

  return (
    <div>
      {board.map((r, i) => (
        <div key={i} className="row">
          {r.map((block, j) => (
            <div
              key={j}
              className={cx(
                "block",
                (block.status === BlockStatus.Known
                  ? knownClassNames
                  : unknownClassNames)[(i + j) % 2]
              )}
              onMouseDown={(e) => handleMouseDown(e, block, i, j)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {block.status === BlockStatus.Unknown && null}
              {block.status === BlockStatus.Known &&
                (block.type === BlockType.Mine
                  ? "X"
                  : block.count
                  ? block.count
                  : "")}
              {block.status === BlockStatus.Questionmarked && "❔"}
              {block.status === BlockStatus.Marked && "🚩"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
