// game
import { TowerStat } from "./towerstat.js"
import { Gun } from "./gun.js"
// config
import { config, category } from "../config/config.js"
// display
import { style } from "../display/style.js"
import { draw } from "../display/draw.js"

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
  // reference to all towers
  static allTowers = towers
  static towers = towers
  // a running number for ID and default label
  static _count = 1
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
      tower.draw(Tower.render)
    })
  }
  // tick all guns and towers
  static tickAll() {
    towers.forEach((tower) => {
      tower.guns.forEach((gun) => {
        gun.tick()
      })
      tower.tick()
    })
  }
  // ##### end tower static fields
  
  // ##### tower public instance fields
  id = Tower._count++ // integer, also increment Tower.create_count
  label = "Tower #" + (this.id).toString(10) // default (string) label for towers, uses base 10
  type = "basic" // default (string) tower type is basic
  targetrot = 0 // target rotation of tower
  parent = this // Tower
  guns = [ ] // Gun[]
  stat = new TowerStat(this) // TowerStat
  controlled = false
  // matter instances
  body = null // Matter.Body
  // ##### end tower public instance fields
  
  constructor(type = "basic", parent = this) {
    towers.push(this)
    
    this.type = type || "basic"
    this.parent = parent.parent || (parent || this)
    this.stat.setType(this.type)
    this.createBody(true)
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
  // alias for this.rotation
  get angle() {
    return this.body.angle
  }
  // alias for this.targetrot
  get direction() {
    return this.targetrot
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
  
  createBody(zero = false) {
    var x, y
    if (zero) {
      x = 0
      y = 0
    } else {
      x = this.x
      y = this.y
    }
    this.body = Bodies.circle(x, y, this.size, {
      isStatic: true,
      label: "Tower Body #" + this.id.toString(10) + " (" + this.type + ")",
      collisionFilter: category.yourTower,
      render: style.tower[this.type],
    })
    // this.body.gravityScale = 0
    // this.body.disableVelocity = true
    // add to world
    Composite.add(Tower.world, this.body)
  }
  
  removeAllGuns() {
    for (let gun of this.guns) {
      gun.remove(false)
    }
    this.guns = [ ]
  }
  
  addGun(guntype) {
    var gun = Gun.create(this, guntype)
    this.guns.push(gun)
    return gun
  }
  
  tick() {
    Body.setAngle(this.body, this.targetrot)
    this.targetrot += 0.01
  }
  
  draw(render) {
    var ctx = render.context
    switch (this.type) {
      case "basic":
        // todo
        let circleStyle = style.gun.basic
        draw.setFillDarkenStroke(ctx, circleStyle)
        draw.circle(render, this.x, this.y, this.guns[0].stat.size)
        break;
    }
  }
  
  // important! if not, the body will stay at 0, 0
  moveTo(x, y) {
    Body.setPosition(this.body, Vector.create(x, y))
  }
  
  turnTo(angle) {
    this.targetrot = angle
  }
  
  // WARNING: testing functions below!
  
  test_1() {
    this.addGun("default")
    console.log(this)
  }
  
  // contemplationOfMortality
}
