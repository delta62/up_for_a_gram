import { Game } from "./game-state";

let render = (game: Game) => {
  console.log(game.info.title);
  console.log(game.info.author);

  for (let row of game.grid) {
    let output = [];
    for (let cell of row) {
      if (cell.black) {
        output.push("#");
      } else {
        output.push(cell.value || ".");
      }
    }
    console.log(output.join(" "));
  }
};

export default render;
