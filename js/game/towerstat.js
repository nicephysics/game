
export var towerstats = {
  basic: {
    size: 30,
    guns: [
      { 
        type: "default",
        stat: ["basic"]
      },
    ],
  }
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
