import init, { Game, Vector } from "../pkg/snake_game.js";
import CONFIG from "./config.js";

export class GameManager {
  constructor() {
    this.restart();
  }

  restart() {
    this.game = new Game(
      CONFIG.WIDTH,
      CONFIG.HEIGHT,
      CONFIG.SPEED,
      CONFIG.SNAKE_LENGTH,
      new Vector( CONFIG.SNAKE_DIRECTION_X,
                  CONFIG.SNAKE_DIRECTION_Y
                )
    );
    console.log(this.game);
  }
}

