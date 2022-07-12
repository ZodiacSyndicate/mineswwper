export enum BlockType {
  Normal,
  Mine
}

export enum BlockStatus {
  Unknown,
  Marked,
  Questionmarked,
  Known
}

export enum GameStatus {
  Start,
  Win,
  Lose
}

export const MouseButton = {
  None: 0,
  Left: 1,
  Right: 2,
  Both: 3
}

export const knownClassNames = ['known-light', 'known-dark']
export const unknownClassNames = ['unknown-light', 'unknown-dark']
