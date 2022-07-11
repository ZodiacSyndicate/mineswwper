import { FC } from "react";
import { IBlock } from "@/utils/types";
import { BlockType, BlockStatus } from "@/utils/const";

export interface BlockProps {
  block: IBlock;
  row: number;
  col: number;
  onMounseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Block: FC<BlockProps> = ({ onMounseDown, block }) => {
  return (
    <div onMouseDown={onMounseDown}>
      {block.type === BlockType.Mine ? "X" : block.count ? block.count : ""}
    </div>
  );
};

export default Block;
