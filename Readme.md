It runs, but

Uncaught Error: recursive use of an object detected which would lead to unsafe aliasing in rust

## lib.rs

```rust
    fn process_movement(&mut self, timespan: f64, movement: Option<Movement>) {
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
        //
        if movement.is_some() {
            let new_direction = match movement.unwrap() {
                Movement::TOP =>   Vector { x: 0_f64, y: -1_f64},
                Movement::RIGHT => Vector { x: 1_f64, y: 0_f64 },
                Movement::DOWN =>  Vector { x: 0_f64, y: 1_f64 },
                Movement::LEFT =>  Vector { x: -1_f64,y: 0_f64},
            }; //^-- new_direction
            
            if !self.direction.is_opposite(&new_direction)
                && !self.direction.equal_to(&new_direction)
            {
                let Vector { x: old_x, y: old_y } = old_head;
                let old_x_rounded = old_x.round();
                let old_y_rounded = old_y.round();
                let new_x_rounded = new_head.x.round();
                let new_y_rounded = new_head.y.round();

                let rounded_x_changed = !are_equal(old_x_rounded, new_x_rounded);
                let rounded_y_changed = !are_equal(old_y_rounded, new_y_rounded);
                if rounded_x_changed || rounded_y_changed {
                    let (old, old_rounded, new_rounded) = if rounded_x_changed {
                        (old_x, old_x_rounded, new_x_rounded)
                    } else {
                        (old_y, old_y_rounded, new_y_rounded)
                    };

                    let breakpoint_component = old_rounded
                        + (if new_rounded > old_rounded {
                            0.5_f64
                        } else {
                            -0.5_f64
                        });

                    let breakpoint = if rounded_x_changed {
                        Vector::new(breakpoint_component, old_y)
                    } else {
                        Vector::new(old_x, breakpoint_component)
                    };

                    let vector =
                        new_direction.scale_by(distance - (old - breakpoint_component).abs());
                    let head = breakpoint.add(&vector);

                    self.snake.push(breakpoint);
                    self.snake.push(head);
                    self.direction = new_direction;
                    return;
                }
            }
        }//^-- if movement.is_some()
     
        self.snake.push(new_head);
    }//^-- process_movement


   fn process_food(&mut self) {
        let snake_len = self.snake.len();
        let head_segment = Segment::new(&self.snake[snake_len - 2], &self.snake[snake_len - 1]);
        // check head relative to food position
        if head_segment.is_point_inside(&self.food) {
            let tail_end = &self.snake[0];
            let before_tail_end = &self.snake[1];
            let tail_segment = Segment::new(before_tail_end, &tail_end);
            let new_tail_end = tail_end.add(&tail_segment.get_vector().normalize());
            self.snake[0] = new_tail_end;
            self.food = get_food(self.width, self.height, &self.snake);
            self.score += 1;
        }
    }

    pub fn process(&mut self, timespan: f64, movement: Option<Movement>) {
        self.process_movement(timespan, movement);
        self.process_food();
    }

    pub fn is_over(&self) -> bool {
        let snake_len = self.snake.len();
        let last = self.snake[snake_len - 1];
        let Vector { x, y } = last;

        // a) check out of bound
        if x < 0_f64 || x > f64::from(self.width) || y < 0_f64 || y > f64::from(self.height) {
            return true;
        }
        
        // b) Check for intersection
        
        // b.1) still to small to intersect
        if snake_len < 5 {
            return false;
        }

        // b.2) check snake bites itself
        let segments = get_segments_from_vectors(&self.snake[..snake_len - 3]);
        return segments.iter().any(|segment| {
            let projected = segment.get_projected_point(&last);
            segment.is_point_inside(&projected) && Segment::new(&last, &projected).length() < 0.5
        });
    }//^-- fn is_over

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


