import { category, config } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"
import { wave } from "./wave.js"

// display stuff here?

import { random } from "../util/random.js"
import { math } from "../util/math.js"

const Vector = Matter.Vector,
      Make = wave.make,
      Repeat = wave.repeat

export var waves = { }

waves.current = 0
waves.init = function(name) {
  waves.current = 0
  waves.waves = waves[name]
}

waves.t1 = [ ]
waves.t1.push(
  { // 1
    type: 1,
    number: 2,
    sep: 10,
    m: 0.1, s: 0.5, g: 0.2, // MSG!
  }, { // 2
    
  }
)
