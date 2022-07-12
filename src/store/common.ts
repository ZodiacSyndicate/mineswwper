import { atom } from "recoil";

export const mouseDownState = atom({
  key: "mouseClickState",
  default: false,
});

export const mouseButtonState = atom({
  key: "mouseButtonState",
  default: 0,
});
