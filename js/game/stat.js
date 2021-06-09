
export var stats = {
  basic: {
    speed: 1,
    mass: 1,
  }
}

export class Stat {
  level = 0
  speed = 1
  mass = 1
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
    this.speed = s.speed
    this.mass = s.mass
  }
  
  setType(type) {
    set(stats[type])
  }
}
