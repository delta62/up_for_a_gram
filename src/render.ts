import { Game } from "./game-state";

let render = (game: Game) => {
  process.stdout.write("\u001B[2J\u001B[0;0f");

  let width = game.grid[0].length;
  let height = game.grid.length;

  console.log(center(game.info.title, width));
  console.log(center(game.info.author, width));

  printHead(width);

  for (let i = 0; i < height; i++) {
    let row = game.grid[i];

    let output = ["┃"];
    for (let cell of row) {
      if (cell.black) {
        output.push("█");
      } else {
        output.push(cell.value || " ");
      }
      output.push("┃");
    }

    console.log(output.join(" "));

    if (i !== height - 1) {
      printDivider(width);
    }
  }

  printTail(width);
};

let printHead = (width: number) => {
  let length = width * 4 - 1;
  let midChars = Array.from({ length }, (_, i) => {
    if (i % 4 === 3) {
      return "┳";
    } else {
      return "━";
    }
  });
  let chars = ["┏"].concat(midChars).concat("┓");
  console.log(chars.join(""));
};

let printTail = (width: number) => {
  let length = width * 4 - 1;
  let midChars = Array.from({ length }, (_, i) => {
    if (i % 4 === 3) {
      return "┻";
    } else {
      return "━";
    }
  });
  let chars = ["┗"].concat(midChars).concat("┛");
  console.log(chars.join(""));
};

let printDivider = (width: number) => {
  let length = width * 4 - 1;
  let chars = ["┣"];
  let midChars = Array.from({ length }, (_, i) => {
    if (i % 4 === 3) {
      return "╋";
    } else {
      return "━";
    }
  });

  chars = chars.concat(midChars).concat("┫");
  console.log(chars.join(""));
};

let center = (text: string, width: number): string => {
  let gridWidth = width * 4 - 1;
  let textWidth = text.length;
  let padWidth = (gridWidth - textWidth) / 2;
  return text.padStart(padWidth + textWidth);
};

export default render;
