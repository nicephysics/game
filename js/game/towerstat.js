
export var towerstats = {
  basic: {
    size: 30,
    speed: 5,
    guns: [ {
      type: "basic",
      stat: ["shooter", "basic"],
      options: { },
    }, ],
  },
  double: {
    size: 25,
    speed: 6,
    guns:  [ {
      type: "double_left",
      stat: ["shooter", "double"],
    }, {
      type: "double_right",
      stat: ["shooter", "double"],
    }, ],
  }
}

export class TowerStat {
  // STATic
  static stats = towerstats
  
  // fields
  level = 0
  size = 1
  speed = 1
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
    this.guns = s.guns
  }
  
  // the real refresh function?
  setType(type) {
    this.set(towerstats[type])
    this.tower.removeAllGuns()
    for (let g of this.guns) {
      this.tower.addGun(g.type, g.stat, g.options)
    }
  }
}
