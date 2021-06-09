import { stats, Stat } from "./stat.js"
import { Gun } from "./gun.js"

if (true) {
  // 2 spaces indent
}

export var towers = [ ] // Tower[]

var Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Vector = Matter.Vector

/*

# How to use class Tower

## IMPORTANT!
Initialize the class first by calling:
Tower.init(render);

## Initialization
var tower = new Tower(); OR
var tower = new Tower(type); OR
var tower = new Tower(type, parent); // parent's parent will be taken, if any

*/
export class Tower {
  // ##### tower static fields
  static types = [
    "basic",
  ]
  static kinds = {
    basic: "shooter",
  }
  static engine = null
  static render = null
  static canvas = null
  static mouse = null
  static world = null
  static init(render) {
    Tower.render = render
    Tower.engine = render.engine
    Tower.canvas = render.canvas
    Tower.mouse = render.mouse
    Tower.world = render.engine.world
  }
  static drawAll() {
    towers.forEach( (tower) => {
      tower.guns.forEach( (gun) => {
        gun.draw(Tower.render)
      } )
    } )
  }
  // ##### end tower static fields
  
  // ##### tower public instance fields
  type = "basic" // string
  position = Vector.create(0, 0) // Vector
  rotation = 0 // floating-point in radians
  master = this // Tower
  guns = null // Gun[]
  stat = new Stat(this) // Stat
  // matter instances
  body = null // Matter.Body
  // ##### end tower public instance fields
  
  constructor(type = "basic", parent = this) {
    towers.push(this)
    // ...
    this.type = type || "basic"
    this.parent = parent.parent || (parent || this)
  }
  
  // ##### tower getter functions
  get kind() {
    return Tower.kinds[this.type]
  }
  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
  }
  get level() {
    return this.stat.level
  }
  get size() {
    return this.stat.size
  }
  get canvas() {
    return Tower.render.canvas
  }
  // ##### end of tower getter functions
  
  // ##### tower setter functions
  set type(t) {
    this.stat.setType(t)
  }
  // ##### end of tower setter functions
  
  // go!
  refresh() {
    this.stat.setType(this.type)
    this.refreshBody() // minus attributes
  }
  
  refreshBody() {
    this.removeBody()
    this.createBody()
  }
  
  removeBody() {
    if (this.body != null) {
      Composite.remove(Tower.world, this.body)
      return true
    } else {
      return false
    }
  }
  
  createBody() {
    this.body = Bodies.circle(this.x, this.y, this.size)
  }
  
  addGun(guntype) {
    var gun = Gun.create(this, guntype)
    this.guns.push(gun)
    return gun
  }
  
  // WARNING: testing functions below!
  
  test_1() {
    this.addGun("default")
    console.log(this)
  }
  
  // contemplationOfMortality
}
