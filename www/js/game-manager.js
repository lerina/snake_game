import init, { Game, Vector } from "../pkg/snake_game.js";
import CONFIG from "./config.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";
import Storage  from "./storage.js";

export class GameManager {
  constructor() {
    this.restart();

    this.view = new View(
      this.game.width,
      this.game.height,
      this.render.bind(this)
    );

    this.controller = new Controller(
      this.onStop.bind(this)
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
        //
        this.lastUpdate = undefined;
        this.stopTime = undefined;
    }//^-- restart

    onStop() {
        const now = Date.now()
        if (this.stopTime) {
          this.stopTime = undefined;
          this.lastUpdate = this.time + now - this.lastUpdate;
        } else {
          this.stopTime = now;
        }
      }

    render() {
        this.view.render(
        this.game.food,
        this.game.get_snake(),
        this.game.score,
        Storage.getBestScore()
    );
  }//^-- render

    tick() {
        if (!this.stopTime) {
            const lastUpdate = Date.now();
            if (this.lastUpdate) {
                this.game.process(lastUpdate - this.lastUpdate, this.controller.movement);   

                if (this.game.is_over()) {
                  this.restart();
                  return;
                }

                if (this.game.score > Storage.getBestScore()) {
                  Storage.setBestScore(this.game.score);
                }     
            }//^-- this.lastUpdate

            this.lastUpdate = lastUpdate;
            this.render();
        }//^-- !this.stopTime
    }//^-- tick

  run() {
    setInterval(this.tick.bind(this), 1000 / CONFIG.FPS); //this.render();
  }  
}//^-- GameManager

