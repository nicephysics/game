
export var towerstats = {
  basic: {
    size: 30,
    guns: ["default"],
  }
}

export class TowerStat {
  // STATic
  static stats = towerstats
  
  // fields
  level = 0
  size = 0
  guns = []
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
    this.guns = s.guns.slice()
  }
  
  setType(type) {
    this.set(towerstats[type])
  }
}
