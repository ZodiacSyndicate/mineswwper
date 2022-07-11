import { atom, selector } from "recoil";
import { GameStatus } from "@/utils/const";

export const gameStatusState = atom({
  key: "gameStatusState",
  default: GameStatus.Start,
});

export const rowCountState = atom({
  key: "rowCountState",
  default: 16,
});

export const colCountState = atom({
  key: "colCountState",
  default: 16,
});

export const mineCountState = atom({
  key: "mineCountState",
  default: 40,
});

export const gameStatus = selector({
  key: "gameStatus",
  get: ({ get }) => ({
    row: get(rowCountState),
    col: get(rowCountState),
    mine: get(mineCountState),
    gameStatus: get(gameStatusState),
  }),
});
