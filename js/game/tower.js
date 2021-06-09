import { stats, Stat } from "./stat.js"
import { Gun } from "./gun.js"
import { config, category } from "../config/config.js"

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

# How to use class: Tower

## IMPORTANT!
Initialize the class first by calling:
Tower.init(render);

## Initialization
var tower = new Tower(); // basic tower
var tower = new Tower(type); // specify type of tower
var tower = new Tower(type, parent); // parent's parent will be taken, if any

*/
export class Tower {
  // ##### tower static fields
  // a running number for ID and default label
  static create_count = 1
  // all tower types (string) in an array
  static types = [
    "basic",
  ]
  // map from type to kind
  static kinds = {
    basic: "shooter",
  }
  // matter.js stuff (static and global) (useful!)
  static engine = null
  static render = null
  static canvas = null
  static mouse = null
  static world = null
  // init function, important!
  static init(render) {
    Tower.render = render
    Tower.engine = render.engine
    Tower.canvas = render.canvas
    Tower.mouse = render.mouse
    Tower.world = render.engine.world
  }
  // draw all guns (and other stuff related to towers not already drawn by matter renderer)
  static drawAll() {
    towers.forEach((tower) => {
      tower.guns.forEach((gun) => {
        gun.draw(Tower.render)
      })
    })
  }
  // ##### end tower static fields
  
  // ##### tower public instance fields
  id = Tower.create_count++ // integer, also increment Tower.create_count
  label = (this.id).toString(10) // default (string) label for towers, uses base 10
  type = "basic" // default (string) tower type is basic
  parent = this // Tower
  guns = [ ] // Gun[]
  stat = new Stat(this) // Stat
  // matter instances
  body = null // Matter.Body
  // ##### end tower public instance fields
  
  constructor(type = "basic", parent = this) {
    towers.push(this)
    
    this.type = type || "basic"
    this.parent = parent.parent || (parent || this)
    this.refresh()
  }
  
  // ##### tower getter functions
  // gets the kind of the tower
  get kind() {
    return Tower.kinds[this.type]
  }
  // returns the tower body's current position (as a Matter.Vector)
  get position() {
    return this.body.position
  }
  // returns the tower body's current angle
  get rotation() {
    return this.body.angle
  }
  // alias for this.rotation, try not to use
  get angle() {
    return this.body.angle
  }
  // this.position's x-coordinate
  get x() {
    return this.position.x
  }
  // this.position's y-coordinate
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
    this.refresh()
  }
  set label(label) {
    this.body.label = label
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
      // remove from world
      Composite.remove(Tower.world, this.body)
      return true
    } else {
      return false
    }
  }
  
  createBody() {
    this.body = Bodies.circle(this.x, this.y, this.size, {
      isStatic: true,
      label: "Tower Body " + this.label,
      collisionFilter: {
        category: category.you,
        // mask: category.all & !category.you
      }
    })
    // add to world
    Composite.add(Tower.world, this.body)
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
