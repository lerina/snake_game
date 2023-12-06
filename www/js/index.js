import init from "../pkg/snake_game.js"
import { GameManager } from "./game-manager.js";


async function run_game(){
  const wasm = await init();

  const gameManager = new GameManager();

  gameManager.restart();

}

run_game();

