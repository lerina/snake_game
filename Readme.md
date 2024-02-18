

## lib.rs

```rust
...
use rand::Rng;

...    fn process_movement(&mut self, timespan: f64) { 
        let distance = self.speed * timespan;
        let mut tail: Vec<Vector> = Vec::new();
        let mut snake_distance = distance;
        while self.snake.len() > 1 {
            let point = self.snake.remove(0);
            let next = &self.snake[0];
            let segment = Segment::new(&point, next);
            let length = segment.length();
            if length >= snake_distance {
                let vector = segment.get_vector().normalize().scale_by(snake_distance);
                tail.push(point.add(&vector));
                break;
            } else {
                snake_distance -= length;
            }
        }//^-- while
        tail.append(&mut self.snake);
        self.snake = tail;
        let old_head = self.snake.pop().unwrap();
        let new_head = old_head.add(&self.direction.scale_by(distance));
        self.snake.push(new_head);
    }//^-- process_movement

    pub fn process(&mut self, timespan: f64) {
        self.process_movement(timespan);
    }

```

## game-manager.js

```javascript
...
  render() {
    ...
  }

  tick() {
        const lastUpdate = Date.now();
        if (this.lastUpdate) {
            this.game.process(lastUpdate - this.lastUpdate);        
        }
        this.lastUpdate = lastUpdate;
        this.render();
  }//^-- tick
  
  run() {
    setInterval(this.tick.bind(this), 1000 / CONFIG.FPS); //this.render();
  }  
}//^-- GameManager

```

---

Reminder

```
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

    pub fn add(&self, other: &Vector) -> Vector {
        Vector::new(self.x + other.x, self.y + other.y)
    }

    pub fn subtract(&self, other: &Vector) -> Vector {
        Vector::new(self.x - other.x, self.y - other.y)
    }

    pub fn scale_by(&self, num: f64) -> Vector {
        Vector::new(self.x * num, self.y * num)
    }

    pub fn length(&self) -> f64 {
        self.x.hypot(self.y)
    }

    pub fn normalize(&self) -> Vector {
        self.scale_by(1_f64 / self.length())
    }
    
    pub fn equal_to(&self, other: &Vector) -> bool {
        are_equal(self.x, other.x) && are_equal(self.y, other.y)
    }
    
    pub fn is_opposite(&self, other: &Vector) -> bool {
        let sum = self.add(other);
        sum.equal_to(&Vector::new(0_f64, 0_f64))
    }

    pub fn dot_product(&self, other: &Vector) -> f64 {
        self.x * other.x + self.y * other.y
    }
}//^-- impl Vector
```

## Build with wasm-pack

```
wasm-pack build --target web --no-typescript --out-dir www/pkg
```

* --target web to specify nobundle
* --no-typescript we are not using TypeScript
* --out-dir www/pkg by default pkg is the same level as src directory. Its cleaner to have all our web stuff in www.


