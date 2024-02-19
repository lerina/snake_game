import { Movement } from "../pkg/snake_game.js";

const MOVEMENT_KEYS = {
  [Movement.TOP]: [87, 38],     // w, ^
  [Movement.RIGHT]: [68, 39],   // d, ->
  [Movement.DOWN]: [83, 40],    // s, v
  [Movement.LEFT]: [65, 37]     // a, <-
}

const STOP_KEY = 32

export class Controller {
  constructor(onStop = () => {}) {
    window.addEventListener('keydown', ({ which }) => {
      this.movement = Object.keys(MOVEMENT_KEYS).find(key => MOVEMENT_KEYS[key].includes(which))
    })
    window.addEventListener('keyup', ({ which }) => {
      this.movement = undefined
      if (which === STOP_KEY) {
        onStop()
      }
    })
  }
}
