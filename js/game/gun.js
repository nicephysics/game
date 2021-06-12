// imports
import { stats, Stat } from "./stat.js"
import { category, config } from "../config/config.js"
import { style } from "../display/style.js"
import { draw } from "../display/draw.js"
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
  // counters
  gunTime = 0
  shot = 0 // reload counter
  // tower
  tower = null
  // positions
  position = Vector.create(0, 0)
  size = Vector.create(0, 0)
  angle = 0
  // shooting
  delay = 0
  dummy = false
  // shape
  shape = "rectangle"
  // styles
  fill = "#a7a7af"
  stroke = "#a7a7af"
  lineWidth = 3
  // others
  aspects = { } // optional
  stat = new Stat(this)
  children = [ ] // Matter.Body[]
  childrenTime = [ ] // queue of int
  
  // constructor
  constructor(tower, location) {
    guns.push(this)
    
    this.tower = tower
    this.setLocation(location)
  }
  
  // get
  get realPosition() {
    if (this.size.x === 0) {
      let x = this.position.x * this.stat.size * 2 // difference!
      let y = this.position.y * this.tower.size * Gun.set.scale
      return Vector.create(
        y * Math.cos(this.direction) + x * -Math.sin(this.direction),
        x * Math.cos(this.direction) + y * Math.sin(this.direction),
      )
    } else {
      let x = this.position.x * this.tower.size * Gun.set.scale
      let y = this.position.y * this.tower.size * Gun.set.scale
      return Vector.create(
        y * Math.cos(this.direction) + x * -Math.sin(this.direction),
        x * Math.cos(this.direction) + y * Math.sin(this.direction),
      )
    }
  }
  get location() {
    return Vector.add(this.tower.position, this.realPosition)
  }
  get x() {
    return this.location.x
  }
  get y() {
    return this.location.y
  }
  get width() {
    return Math.max(this.size.x * this.tower.size * Gun.set.scale, this.stat.size)
  }
  get height() {
    return this.size.y * this.tower.size * Gun.set.scale
  }
  get direction() {
    return this.angle + this.tower.direction
  }
  get gunDifference() {
    return Vector.create(
      this.height * Math.cos(this.direction),
      this.height * Math.sin(this.direction)
    )
  }
  get gunEnd() {
    return Vector.add(this.location, this.gunDifference)
  }
  get gunMiddle() {
    return Vector.add(this.location, Vector.mult(this.gunDifference, 0.5))
  }
  
  // set
  
  // go!
  refreshStats() {
    this.shot = this.delay * this.stat.reloadFrames
  }
  
  draw(render) {
    var ctx = render.context
    draw.setFillDarkenStroke(ctx, this.fill)
    draw.setLineWidth(ctx, this.lineWidth)
    if (this.stroke !== this.fill) {
      draw.setStroke(ctx, this.stroke)
    }
    switch (this.shape) {
      case "rectangle":
        draw.gun(render, this.gunMiddle.x, this.gunMiddle.y, this.height / 2, this.width, 1, this.direction)
        break
      case "circle": // a CIRCULAR gun???
        draw.circle(render, this.gunMiddle.x, this.gunMiddle.y, this.width)
        break
    }
  }
  
  tick() {
    // tick
    this.gunTime++;
    // check whether gun can shoot
    if (this.tower.controlled) {
      // hmmm controlment
      if (this.shot <= this.stat.reloadFrames) {
        this.shot++
      }
      // todo
    } else {
      this.shot++
      while (!this.dummy && this.shot >= this.stat.reloadFrames) {
        this.shot -= this.stat.reloadFrames
        this.shoot()
      }
    }
    // remove earliest created child, if possible
    while (!this.dummy && this.childrenTime[0] < this.gunTime - this.stat.timeFrames) {
      this.childrenTime.shift()
      var b = this.children[0]
      Composite.remove(Tower.world, b)
      this.children.shift()
    }
  }
  
  shoot() {
    var s = this.stat
    var b = Bodies.circle(this.gunEnd.x, this.gunEnd.y, s.size, {
      isStatic: false,
      label: "Bullet #" + (this.bulletcount++) + " from " + this.label,
      collisionFilter: category.yourBullet,
      render: style.projectile.bullet, // todo
      density: s.mass * 0.001,
      friction: s.kineticFriction,
      frictionStatic: s.staticFriction,
      frictionAir: s.airResistance,
    })
    b.gametype = "projectile"
    b.gun = this
    if (s.speed !== 0) {
      Body.setVelocity(b, Vector.mult(
        Vector.create( Math.cos(this.direction), Math.sin(this.direction) ),
        s.speed
      ))
    }
    if (s.inertia !== 1) {
      Body.setInertia(b, b.inertia * s.inertia) // works?
      b.gravityScale = 1 / s.inertia
    }
    Composite.add(Tower.world, b)
    this.children.push(b)
    this.childrenTime.push(this.gunTime)
  }
  
  setStatString(s) {
    s = s || []
    this.stat.setString(s)
    this.refreshStats()
  }
  
  setLocation(set) {
    this.position = Vector.create(set.x, set.y)
    this.size = Vector.create(set.w, set.h)
    this.angle = set.a || 0
    this.delay = set.d || 0
    this.fill = style.gun[set.style] || set.style || "#a7a7af"
    this.stroke = style.gun[set.stroke] || set.stroke || this.fill
    this.lineWidth = set.lineWidth || 3
    this.shape = set.shape || "rectangle"
    this.dummy = set.dummy || false
    this.aspects = set.aspects || { }
    this.setStatString(set.stat)
  }
  
  remove(removeFromArray = true) {
    if (removeFromArray) {
      const index = this.tower.guns.indexOf(this);
      if (index > -1) {
        this.tower.guns.splice(index, 1);
      }
    }
    for (let body of this.children) {
      Composite.remove(Tower.world, body)
    }
    this.tower = null
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
  h: 10, // size.y (*)
  a: 0, // angle (default: 0)
  d: 0, // shooting delay (default: 0)
  style: "#a7a7af", // fill style (default: "#a7a7af")
  stroke: null, // stroke style (default: same as fill style)
  lineWidth: 3, // stroke line width (default: 3)
  shape: "rectangle", // shape (default: rectangle)
  dummy: false, // dummy gun (default: false)
  aspects: { } // shape aspects (default: nothing)
}

Gun.set.default = {
  x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
  shape: "rectangle",
}

Gun.set.basic = {
  x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
  style: "basic",
  stat: ["shooter", "basic"],
}

Gun.set.double_left = {
  x: -0.54, y: 0, w: 0, h: 10, a: 0, d: 0,
  style: "double",
  stat: ["shooter", "double"],
}

Gun.set.double_right = {
  x: 0.54, y: 0, w: 0, h: 10, a: 0, d: 0.5,
  style: "double",
  stat: ["shooter", "double"],
}
