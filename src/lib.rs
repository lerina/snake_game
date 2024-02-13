use js_sys::Array;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Vector {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Self {
        Vector { x, y }
    }

    pub fn subtract(&self, other: &Vector) -> Vector {
        Vector::new(self.x - other.x, self.y - other.y)
    }

    pub fn scale_by(&self, num: f64) -> Vector {
        Vector::new(self.x * num, self.y * num)
    }
}

#[wasm_bindgen]
pub struct Game {
    pub width: i32,
    pub height: i32,
    pub speed: f64,
    pub score: i32,
    pub direction: Vector, // Coord
    pub food: Vector,
    snake: Vec<Vector>,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(width: i32, height: i32, speed: f64, snake_length: i32, direction: Vector) -> Game {
        // center head
        let head_x = width as f64 / 2_f64.round() - 0.5;
        let head_y = height as f64 / 2_f64.round() - 0.5;
        let head = Vector::new(head_x, head_y);
        let tailtip = head.subtract(&direction.scale_by(snake_length as f64));
        let snake = vec![tailtip, head];
        //TODO rnd food
        let food = Vector::new(0.5, 0.5);

        Game {
            width,
            height,
            speed,
            score: 0,
            direction,
            food,
            snake,
        }
    } //^-- new

    pub fn get_snake(&self) -> Array {
        self.snake.clone().into_iter().map(JsValue::from).collect()
    }
}

/*
//-------------------------
#[cfg(test)]
mod tests {
    use super::*;
}
*/
