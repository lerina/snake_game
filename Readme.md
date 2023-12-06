
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
...
```


## Build with wasm-pack

```
wasm-pack build --target web --no-typescript --out-dir www/pkg
```

* --target web to specify nobundle
* --no-typescript we are not using TypeScript
* --out-dir www/pkg by default pkg is the same level as src directory. Its cleaner to have all our web stuff in www.


