
export var towerstats = {
  basic: {
    size: 30,
    guns: [
      { // main gun
        label: "basic",
        type: "basic",
        stat: ["shooter", "basic"]
      },
    ],
  },
  double: {
    size: 25,
    guns: [
      { // left gun
        label: "double left",
        type: "double_left",
        stat: ["shooter", "double"]
      },
      { // right gun
        label: "double right",
        type: "double_right",
        stat: ["shooter", "double"]
      },
    ],
  },
}

export class TowerStat {
  // STATic
  static stats = towerstats
  
  // fields
  level = 0
  size = 0
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
    this.tower.removeAllGuns()
    for (let gun of this.guns) {
      let g = this.tower.addGun(gun.type)
      g.setStatString(gun.stat)
    }
  }
  
  set(s) {
    this.size = s.size || 10
    this.guns = s.guns
  }
  
  setType(type) {
    this.set(towerstats[type])
  }
}
