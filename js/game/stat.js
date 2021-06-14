import { category, config } from "../config/config.js"

export var stats = {
  base: { // all stats that are 1 can be ignored in the definition
    size: 1, // [z] size of projectile, the higher the better
    mass: 1, // [m] mass of projectile, the higher the better
    speed: 1, // [s] speed of projectile, the higher the better
    reload: 1, // [r] reload of the gun, the lower the better
    time: 1, // [t] how long the projectile lasts, the higher the better
    inertia: 1, // [i] gravity scale (sort of), the higher the better
    timeScale: 1, // [ts] slow motion, ???
    restitution: 1, // [e] coefficient of restitution of the projectile, the higher the better
    kineticFriction: 1, // [kf] kinetic friction of the projectile
    staticFriction: 1, // [sf] static friction of the projectile
    airResistance: 1, // [a]
    type: "base", // [y] type of the projectile
    other: { // [o] other options, if type !== "base"
      // object
    },
  },
  shooter: {
    z: 10, m: 10, s: 10, r: 1, t: 10, i: 1, ts: 1, e: 0.4, kf: 0, sf: 0, a: 0.005, y: "base", o: { }
  },
  basic: {
    z: 0.6, m: 1, s: 1, r: 1, t: 1, i: 1, ts: 1, e: 1, kf: 1, sf: 1, a: 1,
  },
  double: {
    // better than basic by a teeny little bit
    z: 0.5, m: 0.9, s: 0.9, r: 1.1, t: 0.8, i: 1, ts: 1, e: 1, kf: 1, sf: 1, a: 1,
  },
  
  enemy: {
    z: 1, m: 1, s: 1, r: 1, t: 1, i: 1, ts: 1, e: 1, kf: 1, sf: 1, a: 1,
  },
  enemyshooter: {
    z: 10, m: 5, s: 5, r: 2, t: 10, i: 1, ts: 1, e: 0.5, kf: 0, sf: 0, a: 0.01, y: "base"
  },
  ballgun: {
    z: 0.5, m: 1, s: 1, r: 1, t: 0.7,
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
  inertia = 1
  timeScale = 1
  restitution = 1
  kineticFriction = 1
  staticFriction = 1
  airResistance = 1
  
  // constructor
  constructor(gun, stat = []) {
    this.gun = gun
    // does a set_base(stats.base) first
    this.set(stat)
  }
  
  // get
  get array() {
    return [
      this.size, this.mass, this.speed, this.reload, this.inertia, this.timeScale, this.restitution, this.kineticFriction, this.staticFriction, this.airResistance
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
    console.log(stat)
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
    this.inertia = s.i || s.inertia || 1
    this.timeScale = s.ts || s.timeScale || 1
    this.restitution = s.e || s.restitution || 1
    this.kineticFriction = s.kf || s.kineticFriction || 1
    this.staticFriction = s.sf || s.staticFriction || 1
    this.airResistance = s.a || s.airResistance || 1
  }

  add(s) {
    this.type = s.y || s.type || "base"
    
    this.size *= s.z || s.size || 1
    this.mass *= s.m || s.mass || 1
    this.speed *= s.s || s.speed || 1
    this.reload *= s.r || s.reload || 1
    this.time *= s.t || s.time || 1
    this.inertia *= s.i || s.inertia || 1
    this.timeScale *= s.ts || s.timeScale || 1
    this.restitution *= s.e || s.restitution || 1
    this.kineticFriction *= s.kf || s.kineticFriction || 1
    this.staticFriction *= s.sf || s.staticFriction || 1
    this.airResistance *= s.a || s.airResistance || 1
  }
}
