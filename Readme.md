
## project setup

```
cargo new snake_game --lib
cd snake_game
mkdir -p www/css www/js
cargo add wasm-bindgen
```

edit `Cargo.toml`, add `crate-type`

```toml
[package]
name = "snake_game"
...

[lib]
crate-type = ["cdylib"]

[dependencies]
getrandom = { version = "0.2.12", features = ["js"] }
rand = "0.8.5" #{ version = "0.8.5", features = ["wasm-bindgen"] }
js-sys = "0.3.68"
wasm-bindgen = "0.2.91"
```

## lib.rs

```rust
...
use rand::Rng;

...
//--- FOOD ---

static EPSILON: f64 = 0.0000001;

fn are_equal(one: f64, another: f64) -> bool {
    (one - another).abs() < EPSILON
}

pub struct Segment<'a> {
    pub start: &'a Vector,
    pub end: &'a Vector,
}

impl<'a> Segment<'a> {
    pub fn new(start: &'a Vector, end: &'a Vector) -> Segment<'a> {
        Segment { start, end }
    }

    pub fn get_vector(&self) -> Vector {
        self.end.subtract(&self.start)
    }

    pub fn length(&self) -> f64 {
        self.get_vector().length()
    }

    pub fn is_point_inside(&self, point: &Vector) -> bool {
        let first = Segment::new(self.start, point);
        let second = Segment::new(point, self.end);
        are_equal(self.length(), first.length() + second.length())
    }

    pub fn get_projected_point(&self, point: &Vector) -> Vector {
        let vector = self.get_vector();
        let diff = point.subtract(&self.start);
        let u = diff.dot_product(&vector) / vector.dot_product(&vector);
        let scaled = vector.scale_by(u);
        self.start.add(&scaled)
    }
}

fn get_segments_from_vectors(vectors: &[Vector]) -> Vec<Segment> {
    let pairs = vectors[..vectors.len() - 1].iter().zip(&vectors[1..]);
    pairs
        .map(|(s, e)| Segment::new(s, e))
        .collect::<Vec<Segment>>()
}

fn get_food(width: i32, height: i32, snake: &[Vector]) -> Vector {
    let segments = get_segments_from_vectors(snake);
    let mut free_positions: Vec<Vector> = Vec::new();
    for x in 0..width {
        for y in 0..height {
            let point = Vector::new(f64::from(x) + 0.5, f64::from(y) + 0.5);
            if segments.iter().all(|s| !s.is_point_inside(&point)) {
                free_positions.push(point)
            }
        }
    }
    let index = rand::thread_rng().gen_range(0_f64..free_positions.len() as f64) as usize;
    free_positions[index]
}
//^--- FOOD ---
```

Pay attention to the rand usage:

```
...
    let index = rand::thread_rng().gen_range(0_f64..free_positions.len() as f64) as usize;
    free_positions[index]
}
```

## Build with wasm-pack

```
wasm-pack build --target web --no-typescript --out-dir www/pkg
```

* --target web to specify nobundle
* --no-typescript we are not using TypeScript
* --out-dir www/pkg by default pkg is the same level as src directory. Its cleaner to have all our web stuff in www.


