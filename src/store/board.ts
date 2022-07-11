import { atom } from "recoil";
import type { IBoard } from "@/utils/types";

export const boardState = atom<IBoard>({
  key: "boardState",
  default: [],
});
