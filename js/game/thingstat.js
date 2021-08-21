import { config } from "../config/config.js"

import { save } from "./save.js"

if (true) {
  // 2 space indent!
}

export const upgradekeys = ["size", "mass", "speed", "reload", "thingspeed", "spread", "air", "thingrot"]

export const upgradelevel = {
  tier: [0, 5, 15, 25],
  ability: [],
}
  
export const upgrademax = {
  // those stats not mentioned will get unlimited upgrade amount
  size: 20,
  mass: 100,
  speed: 100,
  reload: 100,
  thingspeed: 20,
  spread: 20,
  air: 20,
  thingrot: 20,
}

export const upgradestr = {
  size: 0.016,
  mass: 0.075,
  speed: 0.035,
  reload: 0.025,
  thingspeed: 0.025,
  spread: 0.03,
  air: 0.06,
  thingrot: 0.04,
}

export class ThingStat {
  // static
  static upgradekeys = upgradekeys
  static upgradelevel = upgradelevel
  static upgrademax = upgrademax
  
  // fields
  thing = null
  tier = -1
  size = 1
  speed = 1
  rotspeed = 1
  gravityScale = 1
  kineticFriction = null
  staticFriction = null
  points = 0
  upgradetext = "normal"
  upgrademax = null
  upgradestr = null
  upgradeList = [""]
  upgrade = { }
  realMult = { }
  
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
    if (this.thing.gametype === "Enemy" || this.upgrade == null) {
      return this.realMult
    }
    const u = this.upgrade,
          str = this.upgradestr || upgradestr,
          ans = { }
    // 1. size (add 4%)
    ans.size = 1 + u.size * str.size
    // 2. mass (add 7%)
    ans.mass = 1 + u.mass * str.mass
    // 3. speed (add 3%)
    ans.speed = 1 + u.speed * str.speed
    // 4. reload (add 6%)
    ans.reload = 1 / (1 + u.reload * str.reload)
    // 5. thingspeed (add 3%)
    ans.thingspeed = 1 + u.thingspeed * str.thingspeed
    // 6. spread (minus 4%) (was multiply by 97%)
    ans.spread = 1 / (1 + u.spread * str.spread) // Math.pow(0.97, u.spread)
    // 7. air (minus 4%) (was multiply by 96%)
    ans.air = 1 / (1 + u.air * str.air)
    // 8. thingrot (add 4%)
    ans.thingrot = 1 + u.thingrot * str.thingrot
    return ans
  }
  
  get realspeed() {
    return this.speed * this.mult.thingspeed
  }
  
  get realrot() {
    return this.rotspeed * this.mult.thingrot
  }
  
  get canTierUp() {
    return upgradelevel.tier[this.tier] <= this.thing.level
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
    if (o.mass != null) {
      this.mass = o.mass
    }
    if (o.speed != null) {
      this.speed = o.speed
    }
    if (o.rotspeed != null) {
      this.rotspeed = o.rotspeed
    }
    if (o.air != null) {
      this.air = o.air
    }
    if (o.gravity != null) {
      this.gravityScale = o.gravity
    }
    if (o.gravityScale != null) {
      this.gravityScale = o.gravityScale
    }
    if (o.kineticFriction != null) {
      this.kineticFriction = o.kineticFriction
    }
    if (o.staticFriction != null) {
      this.staticFriction = o.staticFriction
    }
    if (o.upgradetext != null) {
      this.upgradetext = o.upgradetext
    }
    if (o.upgrademax != null) {
      this.upgrademax = o.upgrademax
    }
    if (o.upgradestr != null) {
      this.makeUpgradeStr(o.upgradestr)
    }
    if (o.upgrade != null) {
      this.upgradeArray = o.upgrade
    }
    this.makeUpgradeList()
  }
  
  makeMult(options = { }) {
    const o = options
    
    if (o.tier != null) {
      // not multiplicative
      this.tier = o.tier
    }
    
    if (o.z != null) {
      this.size *= o.z
    }
    if (o.size != null) {
      this.size *= o.size
    }
    
    if (o.m != null) {
      this.mass *= o.m
    }
    if (o.mass != null) {
      this.mass *= o.mass
    }
    
    if (o.s != null) {
      this.speed *= o.s
    }
    if (o.speed != null) {
      this.speed *= o.speed
    }
    
    if (o.rs != null) {
      this.rotspeed *= o.rs
    }
    if (o.rotspeed != null) {
      this.rotspeed *= o.rotspeed
    }
    
    if (o.a != null) {
      this.air *= o.a
    }
    if (o.air != null) {
      this.air *= o.air
    }
    
    if (o.g != null) {
      this.gravityScale *= o.g
    }
    if (o.gravity != null) {
      this.gravityScale *= o.gravity
    }
    if (o.gravityScale != null) {
      this.gravityScale *= o.gravityScale
    }
    
    if (o.kineticFriction != null) {
      this.kineticFriction *= o.kineticFriction
    }
    if (o.staticFriction != null) {
      this.staticFriction *= o.staticFriction
    }

    // changes this.thing instead of stat
    const t = this.thing
    if (o.xp != null) {
      // not multiplicative
      t.xp = o.xp
    }
    if (o.r != null) {
      t.xp *= o.r
    }
    if (o.reward != null) {
      t.xp *= o.reward
    }
    if (o.bonusxp != null) {
      // not multiplicative
      t.bonusxp = o.bonusxp
    }
    if (o.b != null) {
      t.bonusxp *= o.b
    }
    if (o.bonus != null) {
      t.bonusxp *= o.bonus
    }
    if (o.d != null) {
      t.enemyOptions.damage *= o.d
    }
    if (o.damage != null) {
      t.enemyOptions.damage *= o.damage
    }
    if (o.enemyDamage != null) {
      // not multiplicative
      t.enemyOptions.damage = o.enemyDamage
    }
    
    // changes realMult... see this.makeRealMult(b)
    if (o.bu != null) {
      // not multiplicative
      this.makeRealMult(o.bu)
    }
    if (o.bulletMult != null) {
      // not multiplicative
      this.makeRealMult(o.bulletMult)
    }
  }
  
  makeRealMult(b) {
    this.upgrade = null
    this.realMult.size = b.size || b.z || 1
    this.realMult.mass = b.mass || b.m || 1
    this.realMult.speed = b.speed || b.s || 1
    this.realMult.reload = b.reload || b.r || 1
    this.realMult.spread = b.spread || b.p || 1
    this.realMult.air = b.air || b.a || 1
    this.realMult.rot = b.rot || b.ro || 1
  }

  makeUpgradeList() {
    if (this.upgradetext == null) {
      return
    }
    const text = config.upgradetext[this.upgradetext],
          umax = this.upgrademax || upgrademax,
          list = [ ]
    for (let k of upgradekeys) {
      if (umax[k]) {
        list.push(text[k]);
      } else {
        list.push("");
      }
    }
    this.upgradeList = list
  }

  makeUpgradeStr(str) {
    if (str == null) {
      this.upgradestr = upgradestr
      return
    }
    this.upgradestr = []
    for (let k of upgradekeys) {
      this.upgradestr[k] = (str[k] || 1) * upgradestr[k]
    }
  }
  
  upgradeStat(key, number, all = false) {
    const currstat = this.upgrade[key],
          maxstat = this.upgrademax[key] - 1
    if (all) {
      if (number > 0) {
        number = Math.min(maxstat - currstat, this.points)
      } else if (number < 0) {
        number = -currstat
      }
    }
    const newstat = currstat + number
    if ( (newstat <= maxstat || maxstat === -1) && newstat >= 0 && this.points >= number) {
      this.upgrade[key] = newstat
      this.refreshPoints()
      save.savewave()
      return true
    } else {
      // todo invalid
      return false
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
  
  save() {
    return this.upgrade    
  }
  
  load(o) {
    if (this.thing.gametype === "Enemy" || this.upgrade == null) {
      return
    }
    this.upgrade = o    
  }
  
}
