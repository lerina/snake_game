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

    tick() {
        const lastUpdate = Date.now();
        if (this.lastUpdate) {
            this.game.process(lastUpdate - this.lastUpdate); //, this.controller.movement);        
        }
        this.lastUpdate = lastUpdate;
        this.render();
    }//^-- tick
  
  run() {
    setInterval(this.tick.bind(this), 1000 / CONFIG.FPS); //this.render();
  }  
}//^-- GameManager

