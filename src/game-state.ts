export interface GameInfo {
  title: string;
  author: string;
}

export type Grid = GridRow[];

export type GridRow = GridCell[];

export interface Parents {
  across: number;
  down: number;
}

export interface GridCell {
  black: boolean;
  value: string;
  number: number | null;
  parents?: Parents;
}

export type SolutionRow = string[];

export interface Clues {
  across: (string | null)[];
  down: (string | null)[];
}

export interface Game {
  info: GameInfo;
  grid: Grid;
  solution: SolutionRow[];
  circles: unknown;
  clues: Clues;
}

export interface CreateEvent {
  type: "create";
  params: { game: Game };
}

export interface CellRef {
  r: number;
  c: number;
}

export interface UpdateCellParams {
  cell: CellRef;
  value: string;
}

export interface UpdateCellEvent {
  type: "updateCell";
  params: UpdateCellParams;
}

// check / reveal: params.scope[0] = {r: 5, c: 2 }
export interface CheckEvent {
  type: "check";
}
export interface RevealEvent {
  type: "reveal";
}

export type Event = CreateEvent | UpdateCellEvent | RevealEvent | CheckEvent;

export let updateGame = (game: Game, event: Event): Game => {
  switch (event.type) {
    case "check":
      return game;
    case "reveal":
      return game;
    case "create":
      if (game !== null) {
        throw new Error("creating a game from a non empty state");
      }
      return event.params.game;
    case "updateCell":
      return updateCell(game, event.params.cell, event.params.value);
    default:
      // console.error(`Unknown event type ${(event as any).type}`);
      // console.error(serialize(event));
      // console.error(serialize(event));
      return game;
  }
};

let updateCell = (game: Game, cell: CellRef, value: string) => {
  let grid = [...game.grid];
  let { r, c } = cell;

  let newCell = { ...grid[r][c], value };
  grid[r][c] = newCell;

  return { ...game, grid };
};
