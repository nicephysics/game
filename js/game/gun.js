// imports
import { category, config } from "../config/config.js"

import { gunset } from "./gunset.js"
import { stats, Stat } from "./stat.js"
import { Tower } from "./tower.js"

import { style } from "../display/style.js"
import { draw } from "../display/draw.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

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
  static set = gunset
  static create(object, gunset, gametype) {
    return new Gun(object, gunset, gametype)
  }
  
  // fields
  id = Gun._count++
  label = "Gun #" + this.id
  bulletcount = 1
  // counters
  gunTime = 0
  shot = 0 // reload counter
  // type
  gametype = ""
  // object backreferences
  tower = null
  enemy = null
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
  constructor(object, location, gametype) {
    guns.push(this)
    
    this.gametype = gametype
    if (gametype === "tower") {
      this.tower = object
    } else if (gametype === "enemy") {
      this.enemy = object
    }
    this.setLocation(location)
  }
  
  // get
  get statSize() {
    return this.stat.size * this.statMult.size
  }
  get realPosition() {
    if (this.size.x === 0) {
      let x = this.position.x * this.statSize * 2 // difference!
      let y = this.position.y * this.objectSize * Gun.set.scale
      return Vector.create(
        y * Math.cos(this.direction) + x * -Math.sin(this.direction),
        x * Math.cos(this.direction) + y * Math.sin(this.direction),
      )
    } else {
      let x = this.position.x * this.objectSize * Gun.set.scale
      let y = this.position.y * this.objectSize * Gun.set.scale
      return Vector.create(
        y * Math.cos(this.direction) + x * -Math.sin(this.direction),
        x * Math.cos(this.direction) + y * Math.sin(this.direction),
      )
    }
  }
  get location() {
    return Vector.add(this.objectPosition, this.realPosition)
  }
  get x() {
    return this.location.x
  }
  get y() {
    return this.location.y
  }
  get width() {
    return Math.max(this.size.x * this.objectSize * Gun.set.scale, this.statSize)
  }
  get height() {
    return this.size.y * this.objectSize * Gun.set.scale
  }
  get object() {
    if (this.gametype === "tower") {
      return this.tower
    } else if (this.gametype === "enemy") {
      return this.enemy
    }
  }
  get objectSize() {
    return this.object.size
  }
  get objectAngle() {
    return this.object.angle
  }
  get objectDirection() {
    return this.object.direction
  }
  get objectPosition() {
    return this.object.position
  }
  get objectGuns() {
    return this.object.guns
  }
  get statMult() {
    return (this.object.stat) ? this.object.stat.mult : false
  }
  get reloadFrames() {
    return this.stat.reloadFrames * ( (this.statMult) ? this.statMult.reload : 1 )
  }
  get direction() {
    return this.angle + this.objectAngle
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
  get shooting() {
    if (this.gametype === "tower") {
      // object is a tower, check stuff
      if (!this.tower.effect.canshoot) {
        return false
      }
      if (!this.tower.isPlayer) {
        return true
      }
      return this.tower.control.shoot || this.tower.control.autoshoot
    } else if (this.gametype === "enemy") {
      // object is an enemy, enemies shoot blindly!
      return true
    }
  }
  
  // set
  set object(thing) {
    if (this.gametype === "tower") {
      this.tower = thing
    } else if (this.gametype === "enemy") {
      this.enemy = thing
    }
  }
  
  // go!
  refreshStats() {
    // empty for now
  }
  
  refreshShot() {
    if (this.shot > (1 - this.delay) * this.reloadFrames) {
      this.shot = (1 - this.delay) * this.reloadFrames
    }
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
    if (this.dummy) return
    // get reload from stat
    var reload = this.reloadFrames
    // check for player existence
    if (this.gametype === "tower" && this.tower.isPlayer) {
      // do something here?
    }
    if (this.shot < reload) {
      this.shot++
    } else {
      if (this.shooting) {
        this.shot++
        while (this.shot >= reload && this.shooting) {
          this.shot -= reload
          this.shoot()
        }
      } else {
        this.refreshShot()
      }
    }
    // something very important
    this.clearChildren()
  }
  
  shoot() {
    var s = this.stat,
        m = this.statMult,
        bodyGametype = (this.gametype === "tower") ? "projectile" : "bullet",
        objectStyle = style[bodyGametype],
        b = Bodies.circle(this.gunEnd.x, this.gunEnd.y, s.size  * m.size, {
          isStatic: false,
          isBullet: true,
          label: "Bullet #" + (this.bulletcount++) + " from " + this.label,
          collisionFilter: (this.gametype === "tower") ? category.yourBullet : category.enemyBullet,
          render: objectStyle.bullet, // big todo
          density: s.mass * m.mass * 0.001,
          friction: s.kineticFriction,
          frictionStatic: s.staticFriction,
          frictionAir: s.airResistance * m.air,
        });
    b.gametype = bodyGametype
    b.gun = this
    b.direction = math.degToRad(random.gauss(math.radToDeg(this.direction), s.spread * m.spread))
    if (s.effect.type) {
      b.effect = s.effect
    }
    if (s.speed !== 0) {
      Body.setVelocity(b, Vector.mult(
        Vector.create( Math.cos(b.direction), Math.sin(b.direction) ),
        s.speed * m.speed
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
  
  clearChildren() {
    // remove earliest created child, if possible
    while (!this.dummy && this.childrenTime[0] < this.gunTime - this.stat.timeFrames) {
      this.childrenTime.shift()
      var b = this.children[0]
      Composite.remove(Tower.world, b)
      this.children.shift()
    }
  }
  
  removeChild(b) {
    var index = this.children.indexOf(b)
    if (index !== -1) {
      this.children.splice(index, 1)
      this.childrenTime.splice(index, 1)
    }
    Composite.remove(Tower.world, b)
  }
  
  setStatString(s) {
    s = s || []
    this.stat.setString(s)
    this.refreshStats()
  }
  
  setLocation(set) {
    this.position = Vector.create(set.x, set.y)
    this.size = Vector.create(set.w, set.h)
    this.angle = (set.a / 180 * Math.PI) || 0
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
      const index = this.objectGuns.indexOf(this);
      if (index > -1) {
        this.objectGuns.splice(index, 1);
      }
    }
    for (let body of this.children) {
      Composite.remove(Tower.world, body)
    }
    this.object = null
  }
  
}
