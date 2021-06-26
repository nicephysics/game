import { category, config } from "../config/config.js"

import { random } from "../util/random.js"
import { math } from "../util/math.js"

import { things } from "./things.js"

if (true) {
  // 2 space indent!
}

export const upgradekeys = ["size", "mass", "speed", "reload", "thingspeed", "spread", "air", "thingrot"]

export class ThingStat {
  // static
  static upgradekeys = upgradekeys
  
  // fields
  thing = null
  tier = -1
  size = 1
  speed = 1
  rotspeed = 1
  points = 0
  upgradetext = "normal"
  upgrade = { }
  
  // constructor
  constructor(thing) {
    this.thing = thing
    this.init()
  }
  
  // get
  get upgradeArray() {
    const ans = []
    for (let key of upgradekeys) {
      ans.push(this.upgrade[key])
    }
    return ans
  }
  
  get mult() {
    const u = this.upgrade,
          ans = { }
    // 1. size (add 4%)
    ans.size = 1 + u.size * 0.04
    // 2. mass (add 7%)
    ans.mass = 1 + u.mass * 0.07
    // 3. speed (add 3%)
    ans.speed = 1 + u.speed * 0.03
    // 4. reload (add 6%)
    ans.reload = 1 / (1 + u.reload * 0.03)
    // 5. thingspeed (add 3%)
    ans.thingspeed = 1 + u.thingspeed * 0.03
    // 6. spread (minus 4%) (was multiply by 97%)
    ans.spread = 1 / (1 + u.spread * 0.04) // Math.pow(0.97, u.spread)
    // 7. air (minus 4%) (was multiply by 96%)
    ans.air = 1 / (1 + u.air * 0.04)
    // 8. thingrot (add 4%)
    ans.thingrot = 1 + u.thingrot * 0.04
    return ans
  }
  
  get realspeed() {
    return this.speed * this.mult.thingspeed
  }
  
  get realrot() {
    return this.rotspeed * this.mult.thingrot
  }
  
  // set
  set upgradeArray(arr) {
    const u = this.upgrade
    for (let i = 0; i < upgradekeys.length; i++) {
      u[upgradekeys[i]] = arr[i]
    }
  }
  
  // go!
  
  tick() {
    // nothing for now
  }
  
  init() {
    for (let key of upgradekeys) {
      this.upgrade[key] = 0
    }
  }
  
  create() {
    // nothing for now
  }
  
  make(options = { }) {
    const o = options
    if (o.tier != null) {
      this.tier = o.tier
    }
    if (o.size != null) {
      this.size = o.size
    }
    if (o.speed != null) {
      this.speed = o.speed
    }
    if (o.rotspeed != null) {
      this.rotspeed = o.rotspeed
    }
    if (o.upgradetext != null) {
      this.upgradetext = o.upgradetext
    }
    if (o.upgrade != null) {
      this.upgradeArray = o.upgrade
    }
  }
  
  refreshPoints() {
    this.thing.refreshLevel()
    
    let points = this.thing.level
    for (let key in this.upgrade) {
      points -= this.upgrade[key]
    }
    this.points = points
  }
  
}
