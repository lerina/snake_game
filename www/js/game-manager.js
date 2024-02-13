import init, { Game, Vector } from "../pkg/snake_game.js";
import CONFIG from "./config.js";
import { View } from "./view.js";


export class GameManager {
  constructor() {
    this.restart();
    this.view = new View(
      this.game.width,
      this.game.height,
      this.render.bind(this)
    );
  }//^-- constructor

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
    
  }//^-- restart

  render() {
    this.view.render(
      this.game.food,
      this.game.get_snake(),
      this.game.score,
      0, //TODO: Storage.getBestScore()
    );
  }//^-- render
  
  run() {
    this.render();
  }  
}//^-- GameManager

