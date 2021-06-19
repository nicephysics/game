
export var towerstats = {
  /* -------------------------------------- TIER 1 -------------------------------------- */
  
  // BASIC
  basic: {
    tier: 1,
    label: "G-0",
    description: "A simple tower with a simple gun.",
    size: 25,
    speed: 5,
    rotspeed: 0.2,
    upgrades: ["twin", "double", "big", "fast", "strong"],
    guns: [ {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "basic",
      },
      stat: ["shooter", "basic"],
      options: { },
    }, ],
  },
  
  /* -------------------------------------- TIER 2 -------------------------------------- */
  
  // TWIN
  twin: {
    tier: 2,
    label: "T-5",
    description: "Two weaker shooters side-by-side, like twins.",
    size: 25,
    speed: 5.05,
    rotspeed: 0.2,
    guns:  [ {
      set: { 
        x: -0.65, y: 0, w: 0, h: 8.5, a: 0, d: 0, 
        style: "twin",
      },
      stat: ["shooter", "twin"],
    }, {
      set: {
        x: 0.65, y: 0, w: 0, h: 8.5, a: 0, d: 0.5,
        style: "twin",
      },
      stat: ["shooter", "twin"],
    }, ],
  },
  
  // DOUBLE
  double: {
    tier: 2,
    label: "D-1",
    description: "Double the gun, double the fun!",
    size: 25,
    speed: 5.16,
    rotspeed: 0.2,
    guns:  [ {
      set: { 
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0, 
        style: "double",
      },
      stat: ["shooter", "double"],
    }, {
      set: {
        x: 0, y: 0, w: 0, h: 8, a: 0, d: 0.5,
        style: "double",
      },
      stat: ["shooter", "double"],
    }, ],
  },
  
  // BIG
  big: {
    tier: 2,
    label: "B-4",
    description: "Slower and bigger projectiles.",
    size: 28,
    speed: 5,
    rotspeed: 0.18,
    guns: [ {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "big",
      },
      stat: ["shooter", "big"],
      options: { },
    }, ],
  },
  
  // STRONG
  strong: {
    tier: 2,
    label: "S-3",
    description: "Faster and heavier projectiles.",
    size: 27,
    speed: 4.6,
    rotspeed: 0.175,
    guns: [ {
      set: {
        x: 0, y: 0, w: 0, h: 11, a: 0, d: 0,
        style: "strong",
      },
      stat: ["shooter", "strong"],
      options: { },
    }, ],
  },
  
  // FAST
  fast: {
    tier: 2,
    label: "F-2",
    description: "Faster rate of fire and smaller projectiles.",
    size: 24,
    speed: 5.3,
    rotspeed: 0.22,
    guns: [ {
      set: {
        x: 0, y: 0, w: 0, h: 7, a: 0, d: 0,
        style: "fast",
      },
      stat: ["shooter", "fast"],
      options: { },
    }, ],
  },
}

export var towermap = { }

let key = ""
for (key in towerstats) {
  towermap[towerstats[key].label] = key
}
for (key in towerstats) {
  let ts = towerstats[key]
  if (ts.hasOwnProperty("upgrades")) {
    ts.displayUpgrades = ts.upgrades.map(upgrade => towerstats[upgrade].label)
  }
}

export var towerlevels = {
  tier: [5, 15, 25], // to be confirmed
  ability: [], // ?
}

export class TowerStat {
  // STATic
  static stats = towerstats
  static map = towermap
  
  // fields
  tier = 0
  size = 1
  speed = 1
  rotspeed = 1
  guns = [] // do not modify!
  tower = null // tower
  // points and upgrade stuff
  points = 0
  upgradetext = "normal"
  upgradekeys = ["size", "mass", "speed", "reload", "towerspeed", "spread", "air"]
  upgrade = { }
  upgradeMax = {
    // those stats not mentioned will get unlimited upgrade amount (e.g. mass, speed)
    size: 19,
    speed: 49,
    reload: 49,
    towerspeed: 19,
    spread: 19,
    air: 19,
  }
  
  constructor(tower) {
    // empty constructor for now
    this.tower = tower
    for (let k of this.upgradekeys) {
      this.upgrade[k] = 0
      this.upgradeMax[k] = this.upgradeMax[k] || -1
    }
    this.refresh()
  }
  
  // get
  get upgradeArray() {
    const ans = []
    for (let k of this.upgradekeys) {
      ans.push(this.upgrade[k])
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
    // 5. towerspeed (add 3%)
    ans.towerspeed = 1 + u.towerspeed * 0.03
    // 6. spread (multiply by 97%)
    ans.spread = Math.pow(0.97, u.spread)
    // 7. air (multiply by 96%)
    ans.air = Math.pow(0.96, u.air)
    return ans
  }
  
  get realspeed() {
    return this.speed * this.mult.towerspeed
  }
  
  // set
  set upgradeArray(arr) {
    const u = this.upgrade
    for (let i = 0; i < this.upgradekeys.length; i++) {
      u[this.upgradekeys[i]] = arr[i]
    }
  }
  
  // go!
  refresh() {
    this.setType(this.tower.type)
    this.refreshPoints()
  }
  
  refreshPoints() {
    this.tower.refreshLevel()
    
    let points = this.tower.level
    for (let k of this.upgradekeys) {
      points -= this.upgrade[k]
    }
    this.points = points
  }
  
  set(s) {
    this.tier = s.tier || 0
    this.size = s.size || 10
    this.speed = s.speed || 1
    this.rotspeed = s.rotspeed || 1
    this.upgradetext = s.upgradetext || "normal"
    this.guns = s.guns
  }
  
  // the real refresh function?
  setType(type) {
    this.set(towerstats[type])
    this.tower.removeAllGuns()
    for (let g of this.guns) {
      this.tower.addGun(g.set, g.stat, g.options)
    }
  }
}
