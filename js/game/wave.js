import { category, config } from "../config/config.js"
import { Enemy } from "./enemy.js"
import { draw } from "../display/draw.js"
import { random } from "../util/random.js"

export var wave = { }

// makes many waves...
wave.make = function(types, seed, options = { }) {
  seed = seed || random.seed()
  var num = options.num || 10, // the base number of enemies
      base = options.base || 1, // the base difficulty of enemies
      mult = options.mult || 1.05, // how much number of enemies increase every wave (multiplicative)
      diff = options.diff || 1.05, // how much difficulty of enemies increase every wave (multiplicative)
      gen = random.fun(seed),
      typeLength = types.length,
      w = {
        types: types,
        seed: seed,
        num: 0,
        waves: [],
      }
  w.next = function() {
    w.num++
    var n = w.num,
        a = gen() * 0.5 + 0.25,
        t = Math.floor(gen() * typeLength),
        wave = { // one wave
          count: n,
          type: types[t],
          number: num * Math.pow(mult, n - 1),
          difficulty: base * Math.pow(diff, n - 1),
          rand: [gen(), gen(), gen(), gen(), gen()], // ok ok ok ok ok enough
        }
    w.waves.push(wave)
    return wave
  }
  w.wave = function(num) { // wave function... no, not THAT wave function...
    while (w.waves.length < num) { // like an if, only better
      w.next()
    }
    return w.waves[num - 1]
  }
  w.fun = w.wave // alias?
  return w // result
}
