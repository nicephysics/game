
export var stats = {
  basic: {
    size: 30,
  }
}

export class TowerStat {
  level = 0
  speed = 0
  mass = 0
  size = 0
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
    this.size = s.size
  }
  
  setType(type) {
    this.set(stats[type])
  }
}
