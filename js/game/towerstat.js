
export var towerstats = {
  /* -------------------------------------- TIER 1 -------------------------------------- */
  
  // BASIC
  basic: {
    label: "G-0",
    description: "A simple tower with a simple gun.",
    size: 30,
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
    label: "T-5",
    description: "Two weaker shooters side-by-side, like twins.",
    size: 27.5,
    speed: 6,
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
    label: "D-1",
    description: "Double the gun, double the fun!",
    size: 30,
    speed: 5,
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
    label: "B-4",
    description: "Slower and bigger projectiles.",
    size: 33,
    speed: 4.5,
    rotspeed: 0.15,
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
    label: "S-3",
    description: "Faster and heavier projectiles.",
    size: 30,
    speed: 4.5,
    rotspeed: 0.15,
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
    label: "F-2",
    description: "Faster rate of fire and smaller projectiles.",
    size: 25,
    speed: 6,
    rotspeed: 0.25,
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
  ts.displayUpgrades = ts.upgrades.map(upgrade => towerstats[upgrade].label)
}

export class TowerStat {
  // STATic
  static stats = towerstats
  static map = towermap
  
  // fields
  level = 0
  size = 1
  speed = 1
  rotspeed = 1
  guns = [] // do not modify!
  tower = null // tower
  
  constructor(tower) {
    // empty constructor for now
    this.tower = tower
    this.refresh()
  }
  
  // get
  
  // set
  
  // go!
  refresh() {
    this.setType(this.tower.type)
  }
  
  set(s) {
    this.size = s.size || 10
    this.speed = s.speed || 1
    this.rotspeed = s.rotspeed || 1
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
