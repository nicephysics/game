
export var enemystats = {
  base: { // base stats, all stats are multiplied by this
    control: "none", // controller of enemy...
    mass: 1, // mass of enemy
    speed: 1, // initial velocity of enemy
    size: 1, // size of enemy
    air: 1, // air resistance of enemy
    inertia: 1, // inertia of enemy
    gravity: 1, // gravity scale of enemy
    reward: 1,
    guns: [],
  }, // end of base stats...
  // now for normal enemies
  ball: {
    control: "none",
    mass: 0.2,
    speed: 1,
    size: 12,
    air: 0.02,
    gravity: 0.1,
    reward: 11,
  },
  // simple shooter enemies
  ballgun: {
    control: "aim_player",
    mass: 0.15,
    speed: 0.6,
    size: 20,
    air: 0.03,
    gravity: 0.12,
    reward: 21,
    guns: [ { 
        type: "ballgun",
        stat: ["enemy", "enemyshooter", "ballgun"],
        options: { },
    }, ],
  },
}

export class EnemyStat {
  // static
  static stats = enemystats
  
  // fields
  level = 0
  mass = 1
  speed = 1
  size = 1
  air = 1
  gravity = 1
  reward = 1
  guns = [] // do not modify!
  enemy = null // related enemy
  
  // constructor
  constructor(enemy) {
    this.enemy = enemy
    // this.refresh()
  }
  
  // get
  
  // set
  
  // go!
  refresh() {
    this.setType(this.enemy.type)
  }
  
  setBase(s) {
    this.mass = s.mass || 1
    this.speed = s.speed || 1
    this.size = s.size || 1
    this.air = s.air || 1
    this.gravity = s.gravity || 1
    this.reward = s.reward || 1
      
    this.guns = s.guns || []
  }
  
  add(s) {
    this.mass *= s.mass || 1
    this.speed *= s.speed || 1
    this.size *= s.size || 1
    this.air *= s.air || 1
    this.gravity *= s.gravity || 1
    this.reward *= s.reward || 1
    
    this.guns = s.guns || []
  }
  
  // the real refresh function?
  setType(type) {
    // set base stats
    this.setBase(enemystats.base)
    // and then add some more stats
    var e = enemystats[type]
    this.enemy.controlType = e.control
    while (e != null) {
      this.add(e)
      e = enemystats[e.parent]
    }
    // init guns too
    this.enemy.removeAllGuns()
    for (let g of this.guns) {
      this.enemy.addGun(g.type, g.stat, g.options)
    }
  }
}
