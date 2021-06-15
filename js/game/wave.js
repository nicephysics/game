import { category, config } from "../config/config.js"

import { Enemy } from "./enemy.js"

import { draw } from "../display/draw.js"

import { random } from "../util/random.js"
import { math } from "../util/math.js"

export var wave = { }

// makes many waves...
wave.make = function(types, seed, options = { }) {
  seed = seed || random.seed()
  var num = options.num || 10, // the base number of enemies
      base = options.base || 1, // the base difficulty of enemies
      mult = options.mult || 1.05, // how much number of enemies increase every wave (multiplicative)
      diff = options.diff || 1.05, // how much difficulty of enemies increase every wave (multiplicative)
      sep = options.sep || [0.5, 0.75, 1.0, 1.4, 1.8], // the separation time of enemies
      sepmult = options.sepmult || 3, // the separation time of enemies
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
        sep_t = Math.floor(gen() * sep.length),
        separation = sep[sep_t],
        w1 = { // one wave
          count: n,
          type: types[t],
          number: num * Math.pow(mult, n - 1) / Math.pow(separation, 0.5),
          sep: sepmult * separation,
          difficulty: base * Math.pow(diff, n - 1) * Math.pow(separation, 0.8),
          rand: [gen(), gen(), gen(), gen(), gen()], // ok ok ok ok ok enough
        }
    w.waves.push(w1)
    return w1
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

wave.get = function(type, number, sep, difficulty, options = { }) {
  return {
    type: type,
    number: number,
    sep: sep,
    difficulty: difficulty,
    options: { },
  }
}

// repeats a wave many times with changing number/difficulty (note: o stands for options)
/* possible options: {
  mult: {
    number: 1,
    difficulty: 1,
    sep: 1,
  },
  add: {
    number: 0,
    difficulty: 0,
  }
  septypes: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0],
  random: false,
  seed: null, // random seed
  change: false, // do the values change?
  start: 1, // starting wave
} */
wave.repeat = function(types, number, sep, difficulty, rep, o = { }) {
  var types = (types instanceof Array) ? types : [types],
      mult = o.mult || { },
      add = o.add || { },
      septypes = o.septypes || [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0],
      isrand = o.random || false,
      gen = (isrand) ? random.fun(o.seed || 1234567890) : function() { console.log("Why is the gen() function in wave.repeat called?") },
      ischange = o.change || true,
      ans = [ ]
  
  for (let i = 0; i < rep; ++i) {
    var separation = (isrand) ? septypes[Math.floor(gen() * septypes.length)] : septypes[i % septypes.length]
    ans.push( {
      type: (isrand) ? types[Math.floor(gen() * types.length)] : types[i % types.length],
      number: number / Math.pow(separation, 0.5),
      sep: sep * separation,
      difficulty: difficulty * Math.pow(separation, 0.8),
    } )
    if (ischange /* && i + 1 < rep */) {
      number *= mult.number || 1
      difficulty *= difficulty.number || 1
      sep *= sep.number || 1
      number += add.number || 1
      difficulty += add.difficulty || 1
    }
  }
  
  return ans
}
