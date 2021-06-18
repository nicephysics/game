import { category, config } from "../config/config.js"

export var stats = {
  base: { // all stats that are 1 can be ignored in the definition
    size: 1, // [z] size of projectile, the higher the better
    mass: 1, // [m] mass of projectile, the higher the better
    speed: 1, // [s] speed of projectile, the higher the better
    reload: 1, // [r] reload of the gun, the lower the better
    time: 1, // [t] how long the projectile lasts, the higher the better
    spread: 1, // [p] the spread of the gun, the lower the better
    inertia: 1, // [i] gravity scale (sort of), the higher the better
    timeScale: 1, // [ts] slow motion, ???
    restitution: 1, // [e] coefficient of restitution of the projectile, the higher the better
    kineticFriction: 1, // [kf] kinetic friction of the projectile
    staticFriction: 1, // [sf] static friction of the projectile
    airResistance: 1, // [a]
    effect: { type: "none", }, // [eff] effect caused by the projectile
    type: "base", // [y] type of the projectile
    other: { // [o] other options, if type !== "base"
      // object
    },
  },
  /*** SIZE      MASS      SPEED     RELOAD    TIME      SPREAD  ***/
  shooter: {
    z: 10,    m: 5,     s: 10,    r: 1,     t: 10,    p: 1,     i: 1, ts: 1, e: 0.4, kf: 0, sf: 0, a: 0.005, y: "base",
  }, basic: { // basic gun
    z: 0.6,   m: 1,     s: 1,     r: 1,     t: 1,     p: 2.0,   a: 1.1, // goodness: 0.36
  }, double: { // better than basic by a teeny little bit when doubled (except spread)
    z: 0.5,   m: 1,     s: 0.95,  r: 1.1,   t: 0.8,   p: 2.4,           // goodness: 0.410
  }, twin: { // better than double, of course
    z: 0.55,  m: 1,     s: 0.9,   r: 1.05,  t: 0.9,   p: 2.8,           // goodness: 0.467
  }, big: { // slower but heavier, slower rate of fire
    z: 0.85,  m: 1.2,   s: 0.8,   r: 1.3,   t: 1,     p: 2.0,           // goodness: 0.427
  }, strong: { // faster and stronger, slow rate of fire
    z: 0.65,  m: 1,     s: 1.2,   r: 1.5,   t: 1,     p: 1.5,   a: 0.9, // goodness: 0.428
  }, fast: { // faster rate of fire, pew pew
    z: 0.45,  m: 0.8,   s: 1.05,  r: 0.5,   t: 1,     p: 1.5,           // goodness: 0.424
  },
  
  enemy: {
    z: 1, m: 1, s: 1, r: 1, t: 1, p: 1, i: 1, ts: 1, e: 1, kf: 1, sf: 1, a: 1,
  },
  enemyshooter: {
    z: 10, m: 3, s: 5, r: 2, t: 10, p: 1, i: 1, ts: 1, e: 0.5, kf: 0, sf: 0, a: 0.01, y: "base", eff: {},
  },
  ballgun: {
    z: 0.5, m: 1, s: 1, r: 1.2, t: 0.7, p: 3,
    eff: { 
      type: "stun", 
      duration: 2,
      antiafter: 1,
    },
  },
}

export class Stat {
  // STATic
  static count = 1
  static stats = stats // just another reference (when only importing Stat)
  
  // fields
  id = Stat.count++
  gun = null
  size = 1
  mass = 1
  speed = 1
  reload = 1
  time = 1
  spread = 1
  inertia = 1
  timeScale = 1
  restitution = 1
  kineticFriction = 1
  staticFriction = 1
  airResistance = 1
  effect = { }
  
  // constructor
  constructor(gun, stat = []) {
    this.gun = gun
    // does a set_base(stats.base) first
    this.set(stat)
  }
  
  // get
  get array() {
    return [
      this.size, this.mass, this.speed, this.reload, this.time, this.spread, this.inertia, this.timeScale, this.restitution, this.kineticFriction, this.staticFriction, this.airResistance
    ]
  }
  // don't use, just use console.log(this)!
  get string() {
    return "Stat #" + this.id + " " + this.array.toString()
  }
  get reloadFrames() {
    return this.reload * config.FPS // 60 fps?
  }
  get timeFrames() {
    return this.time * config.FPS
  }
  
  // set
  
  // go!
  set(stat) {
    this.set_base(stats.base)
    if (stat instanceof Array) {
      for (let s of stat) {
        this.add(s)
      }
    } else {
      this.add(stat)
    }
  }
  
  setString(stat) {
    this.set_base(stats.base)
    if (stat instanceof Array) {
      for (let s of stat) {
        this.add(stats[s])
      }
    } else {
      this.add(stats[stat])
    }
  }
  
  set_base(s) {
    this.size = s.z || s.size || 1
    this.mass = s.m || s.mass || 1
    this.speed = s.s || s.speed || 1
    this.reload = s.r || s.reload || 1
    this.time = s.t || s.time || 1
    this.spread = s.p || s.spread || 1
    this.inertia = s.i || s.inertia || 1
    this.timeScale = s.ts || s.timeScale || 1
    this.restitution = s.e || s.restitution || 1
    this.kineticFriction = s.kf || s.kineticFriction || 1
    this.staticFriction = s.sf || s.staticFriction || 1
    this.airResistance = s.a || s.airResistance || 1
  }

  add(s) {
    this.type = s.y || s.type || "base"
    this.effect = s.eff || s.effect || { }
    
    this.size *= s.z || s.size || 1
    this.mass *= s.m || s.mass || 1
    this.speed *= s.s || s.speed || 1
    this.reload *= s.r || s.reload || 1
    this.time *= s.t || s.time || 1
    this.spread *= s.p || s.spread || 1
    this.inertia *= s.i || s.inertia || 1
    this.timeScale *= s.ts || s.timeScale || 1
    this.restitution *= s.e || s.restitution || 1
    this.kineticFriction *= s.kf || s.kineticFriction || 1
    this.staticFriction *= s.sf || s.staticFriction || 1
    this.airResistance *= s.a || s.airResistance || 1
  }
}
