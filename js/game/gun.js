// imports
import { stats, Stat } from "./stat.js"
import { category, config } from "../config/config.js"
import { style } from "../display/style.js"
import { Tower } from "./tower.js"
// drawing?

if (true) {
  // 2 spaces
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Vector = Matter.Vector

export var guns = [ ] // Gun[]

export class Gun {
  // static
  static _count = 1
  static set = { } // to be filled later
  static create(tower, guntype) {
    return new Gun(tower, Gun.set[guntype])
  }
  
  // fields
  id = Gun._count++
  label = "Gun #" + this.id
  bulletcount = 1
  tower = null
  position = Vector.create(0, 0)
  size = Vector.create(0, 0)
  angle = 0
  shape = "rectangle"
  aspects = { } // optional
  stat = new Stat(this)
  children = [ ] // Matter.Body[]
  shot = 0 // counter
  
  // constructor
  constructor(tower, location, stat) {
    guns.push(this)
    
    this.tower = tower
    this.setStat(stat)
    this.setLocation(location)
  }
  
  // get
  get location() {
    return Vector.add(this.tower.position, Vector.mult(this.position, this.tower.size * Gun.set.scale))
  }
  get x() {
    return this.location.x
  }
  get y() {
    return this.location.y
  }
  get width() {
    return this.size.x * this.tower.size * Gun.set.scale
  }
  get height() {
    return this.size.y * this.tower.size * Gun.set.scale
  }
  get direction() {
    return this.angle + this.tower.direction
  }
  get gunDifference() {
    return Vector.create(
      this.height * Math.sin(this.direction),
      this.height * Math.cos(this.direction)
    )
  }
  get gunEnd() {
    return Vector.add(this.location, this.gunDifference)
  }
  
  // set
  
  // go!
  draw(render) {
    var ctx = render.context
    switch (this.shape) {
      case "rectangle":
        // todo
        break;
      case "circle": // a CIRCULAR gun???
        // todo
        break;
    }
  }
  
  tick() {
    this.shot++
    if (this.tower.controlled) {
      // hmmm
    } else {
      if (this.shot > this.stat.reloadFrames) {
        this.shot = 0
        this.shoot()
      }
    }
  }
  
  shoot() {
    var s = this.stat
    var b = Bodies.circle(this.gunEnd.x, this.gunEnd.y, this.width * s.size, {
      isStatic: false,
      label: "Bullet #" + (this.bulletcount++) + " from " + this.label,
      categoryFilter: category.yourBullet,
      render: style.tower.basic, // todo
      density: s.mass,
      friction: s.kineticFriction,
      frictionStatic: s.staticFriction,
      frictionAir: s.airResistance,
      velocity: Vector.mult(this.direction, s.speed),
    })
    // b.setInertia(b.inertia * s.inertia) // ?
    Composite.add(Tower.world, b)
    this.children.push(b)
  }
  
  setStat(s) {
    this.stat.set(s)
  }
  
  setLocation(set) {
    this.position = Vector.create(set.x, set.y)
    this.size = Vector.create(set.w, set.h)
    this.angle = set.a || 0
    this.shape = set.s || "rectangle"
    this.aspects = set.aspects || { }
  }
}

Gun.set = {
  // overall gun scale
  scale: 0.1,
}

Gun.set.some_random_comments = {
  x: 0, // position.x (*)
  y: 0, // position.y (*)
  w: 0, // size.x (*)
  h: 50, // size.y (*)
  a: 0, // angle (default: 0)
  s: "", // shape (default: rectangle)
  aspects: { } // shape aspects (default: nothing)
}

Gun.set.default = {
  x: 0, y: 0, w: 0, h: 50, a: 0, s: "rectangle",
}
