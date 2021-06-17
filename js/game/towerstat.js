
export var towerstats = {
  basic: {
    label: "G-0",
    size: 30,
    speed: 5,
    rotspeed: 0.2,
    guns: [ {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "basic",
      },
      stat: ["shooter", "basic"],
      options: { },
    }, ],
  },
  twin: {
    label: "T-5",
    size: 25,
    speed: 6,
    rotspeed: 0.2,
    guns:  [ {
      set: { 
        x: -0.65, y: 0, w: 0, h: 7, a: 0, d: 0, 
        style: "twin",
      },
      stat: ["shooter", "twin"],
    }, {
      set: {
        x: 0.65, y: 0, w: 0, h: 7, a: 0, d: 0.5, 
        style: "twin",
      },
      stat: ["shooter", "twin"],
    }, ],
  },
  double: {
    label: "D-1",
    size: 27.5,
    speed: 5,
    rotspeed: 0.2,
    guns:  [ {
      set: { 
        x: 0, y: 2.5, w: 0, h: 10, a: 0, d: 0, 
        style: "double",
      },
      stat: ["shooter", "double"],
    }, {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0.5,
        style: "double",
      },
      stat: ["shooter", "double"],
    }, ],
  },
}

export var towermap = { }

for (let k in towerstats) {
  towermap[towerstats[k].label] = k
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
