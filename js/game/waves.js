import { category, config } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"
import { wave } from "./wave.js"

// display stuff here?

import { random } from "../util/random.js"
import { math } from "../util/math.js"

if (true) {
  // 2 space indent!
}

const Vector = Matter.Vector,
      Make = wave.make, // use or not?
      Repeat = wave.repeat

// to fill up later
export var waves = { }

waves.current = 0
waves.waves = null
waves.init = function(name) {
  waves.current = 0
  waves.waves = waves[name]
}

waves.start = function() {
  if (waves.waves) {
    ++waves.current
    Enemy.sendwave(waves.waves.wave[waves.current])
  }
}


waves.tut1 = {
  wave: [],
}
waves.tut1.wave.push(
  { // 1
    type: "asteroid",
    rating: 1,
    number: 2,
    sep: 10,
    m: 0.1, s: 0.5, g: 0.2, // MSG!
  }, { // 2
    type: "asteroid",
    rating: 1,
    number: 5,
    sep: 8,
    m: 0.1, s: 0.5, g: 0.2, // MSG!    
  }
)
waves.tut1.text = {
  [1]: ["Welcome to the tutorial! You are a [thing] trying to protect the planet from incoming asteroids.",
        "Use ↑↓→← keys to move and click (and hold) to launch a projectile.",
        "Press the start button to begin! Asteroids will begin to appear after a while."
        ],
  [2]: ["Did you hit the 2 asteroids away? More of them will come this time..."],
  [3]: ["The points you gain from hitting asteroids can be used for upgrading!",
        "Press the statistics button in the bottom right (or press U) to enter the upgrade screen.",
        "From there, you can press the upgrade button!",
        ],
}
