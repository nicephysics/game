// imports
import { category, config } from "../config/config.js"

import { stats, Stat } from "./stat.js"
import { Thing } from "./thing.js"
import { things } from "./things.js"
import { Tower } from "./tower.js"

import { style } from "../display/style.js"
import { draw } from "../display/draw.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

if (true) {
  // 2 space indent!
}

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Vector = Matter.Vector

const gunscale = 0.1

export class Gun {
  // static
  static _count = 1
  static gunscale = gunscale
  static create(thing, gunset) {
    return new Gun(thing, gunset)
  }
  
  // fields
  id = Gun._count++
  label = "Gun #" + this.id
  bulletcount = 1
  // counters
  gunTime = 0
  shot = 0 // reload counter
  // thing
  thing = null
  // positions
  position = Vector.create(0, 0)
  size = Vector.create(0, 0)
  angle = 0
  // shooting
  delay = 0
  dummy = false
  shootType = "defaultGunShootThing"
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
  constructor(thing, gunset) {    
    this.thing = thing
    this.make(gunset)
  }
  
  // get
  get statSize() {
    return this.stat.size * this.statMult.size
  }
  
  get realPosition() {
    if (this.size.x === 0) {
      let x = this.position.x * this.statSize * 2 // difference!
      let y = this.position.y * this.thing.size * gunscale
      return Vector.create(
        y * Math.cos(this.direction) + x * -Math.sin(this.direction),
        x * Math.cos(this.direction) + y * Math.sin(this.direction),
      )
    } else {
      let x = this.position.x * this.thing.size * gunscale
      let y = this.position.y * this.thing.size * gunscale
      return Vector.create(
        y * Math.cos(this.direction) + x * -Math.sin(this.direction),
        x * Math.cos(this.direction) + y * Math.sin(this.direction),
      )
    }
  }
  
  get location() {
    return Vector.add(this.thing.position, this.realPosition)
  }
  get x() {
    return this.location.x
  }
  get y() {
    return this.location.y
  }
  
  get direction() {
    return this.angle + this.thing.angle
  }
  
  get width() {
    return Math.max(this.size.x * this.thing.size * gunscale, this.statSize)
  }
  get height() {
    return this.size.y * this.thing.size * gunscale
  }
  
  get gunDifference() {
    return Vector.create(
      this.height * Math.cos(this.direction),
      this.height * Math.sin(this.direction)
    )
  }
  get gunMiddle() {
    return Vector.add(this.location, Vector.mult(this.gunDifference, 0.5))
  }
  get gunEnd() {
    return Vector.add(this.location, this.gunDifference)
  }
  
  get statMult() {
    return (this.thing.stat) ? this.thing.stat.mult : false
  }
  get reloadFrames() {
    return this.stat.reloadFrames * ( (this.statMult) ? this.statMult.reload : 1 )
  }
  
  get shooting() {
    // thing is a tower, check stuff
    if (!this.thing.effect.canshoot) {
      return false
    }
    // if (!this.thing.isPlayer) return true
    return this.thing.control.shoot || this.thing.control.autoshoot
  }
  
  // set
  
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
    const ctx = render.context
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
    const reload = this.reloadFrames
    if (this.shot < reload) {
      this.shot++
      // this.refreshShot() // ?
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
    const s = this.stat,
          m = this.statMult,
          t = new Thing(this.gunEnd, this.thing),
          toMake = things[this.shootType]
    t.make(toMake)
    t.stat.make({
      tier: null,
      size: s.size * m.size,
      speed: s.speed * m.speed,
      rotspeed: 0.2,
      mass: s.mass * m.mass,
      air: s.airResistance * m.air,
      gravityScale: 1 / s.inertia,
      kineticFriction: s.kineticFriction,
      staticFriction: s.staticFriction,
    })
    t.label = this.thing.parent.label + " " + t.label
    t.create()
    const b = t.body
    b.gun = this
    b.thing = t
    b.direction = math.degToRad(random.gauss(math.radToDeg(this.direction), s.spread * m.spread))
    if (s.speed !== 0) {
      const vel = Vector.mult(
        Vector.create( Math.cos(b.direction), Math.sin(b.direction) ),
        s.speed * m.speed
      )
      b.initialVelocity = vel
      Body.setVelocity(b, vel)
    }
    if (s.effect.type) {
      b.effect = s.effect
    }
    if (s.inertia !== 1) {
      // Body.setInertia(b, b.inertia * s.inertia) // works?
      b.gravityScale = 1 / s.inertia
    }
    // push to children and childrenTime
    this.children.push(t)
    this.childrenTime.push(this.gunTime)
  }
  
  /*
  oldShoot() {
    const s = this.stat,
          m = this.statMult,
          bodyGametype = (this.thing.gametype === "tower") ? "projectile" : "bullet",
          objectStyle = style[bodyGametype],
          b = Bodies.circle(this.gunEnd.x, this.gunEnd.y, s.size * m.size, {
            isStatic: false,
            isBullet: true,
            label: "Bullet #" + (this.bulletcount++) + " from " + this.label,
            collisionFilter: (this.thing.gametype === "tower") ? category.yourBullet : category.enemyBullet,
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
    Composite.add(Thing.world, b)
    this.children.push(b)
    this.childrenTime.push(this.gunTime)
  }
  */
  
  clearChildren() {
    // remove earliest created child, if possible
    while (!this.dummy && this.childrenTime[0] < this.gunTime - this.stat.timeFrames) {
      this.childrenTime.shift()
      const thing = this.children[0]
      thing.remove()
      this.children.shift()
    }
  }
  
  removeChild(thing) {
    const index = this.children.indexOf(thing)
    if (index !== -1) {
      this.children.splice(index, 1)
      this.childrenTime.splice(index, 1)
    }
    thing.remove()
  }
  
  setStatString(s) {
    s = (Array.isArray(s)) ? s : []
    this.stat.setString(s)
    this.refreshStats()
  }
  
  make(options) {
    const o = options
    if (o.set != null) {
      const set = o.set
      this.position = Vector.create(set.x, set.y)
      this.size = Vector.create(set.w, set.h)
      this.angle = (set.a / 180 * Math.PI) || 0
      this.delay = set.d || 0
      this.fill = style.gun[set.style] || set.style || "#a7a7af"
      this.stroke = style.gun[set.stroke] || set.stroke || this.fill
      this.lineWidth = set.lineWidth || 0
      this.shape = set.shape || "rectangle"
      this.dummy = set.dummy
      this.aspects = set.aspects || { }
    }
    if (o.type != null) {
      this.shootType = o.type
    }
    if (o.stat != null) {
      this.setStatString(o.stat)
    }
  }
  
  remove(removeFromArray = true) {
    if (removeFromArray) {
      const index = this.thing.guns.indexOf(this);
      if (index > -1) {
        this.thing.guns.splice(index, 1);
      }
    }
    for (let child of this.children) {
      child.remove()
    }
    this.thing = null
  }
  
}
