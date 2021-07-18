import { category, config } from "../config/config.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

import { draw } from "../display/draw.js"
import { style } from "../display/style.js"
import { ui } from "../display/ui.js"

import { ThingStat } from "./thingstat.js"
import { things } from "./things.js"
import { Controller } from "./controller.js"
import { Effect } from "./effect.js"
import { Enemy, enemies } from "./enemy.js"
import { Gun } from "./gun.js"

if (true) {
  // 2 space indent!
}

// matter "imports"
const Bodies = Matter.Bodies,
      Body = Matter.Body,
      Common = Matter.Common,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Mouse = Matter.Mouse,
      Vector = Matter.Vector,
      Vertices = Matter.Vertices

// everything!
export var everything = [ ]

// LIFE CYCLE of a THING
/************************************************************************************************************\
*                                                                                                            *
*     0. Thing.init(render);                       // important!!! at the start, initialize the class.       *
*     1. let thing = new Thing(position, parent);  // thing object is created! [parent] is optional          *
*     2. thing.make(things[?]);                    // make the thing!                                        *
*     3. thing.create();                           // create the thing!                                      *
*     4. thing.tick(); thing.draw();               // do this every step (in game/update.js)                 *
*     5. thing.remove();                           // destroy the thing! boom!                               *
*                                                                                                            *
\************************************************************************************************************/
// a Thing, what else?
export class Thing {
  
  // static
  
  static things = things
  static everything = everything
  
  // matter.js stuff (static and global) (useful!)
  static render = null
  static engine = null
  static canvas = null
  static mouse = null
  static world = null
  static runner = null
  
  // init function, important!
  static init(render, runner) {
    Thing.render = render
    Thing.engine = render.engine
    Thing.canvas = render.canvas
    Thing.mouse = render.mouse
    Thing.world = render.engine.world
    Thing.runner = runner
  }
  
  
  // fields
  
  gametype = "none" // none by default
  label = "Thing" // default
  type = "unknown" // default
  targetrot = 0 // rot
  targetpos = null // pos
  parent = this
  guns = [ ]
  xp = 0
  level = 1
  stat = new ThingStat(this)
  effect = new Effect(this)
  control = { }
  controller = new Controller(this) // the second most important thing!
  body = null // the most important thing!
  static = false
  exists = false
  // draw stuffs
  shape = "circle" // default
  shapeType = "circle" // default, determined by shape
  vertices = [] // import java.*.*; Matter.Vector[] v = new Matter.Vector[5]()
  accessories = [] // typedef std::array<std::pair<std::string, int>> accessories_t (e.g. { type: "C++", layer: -1 to 5 })
  style = { // cascading _____ sheets
    render: null, // matter render style
    // other styles? todo
  }
    // options
  options = {
    tickable: true,
    drawable: true,
    active: true,
    drawLayer: 0, // ? not implemented yet!
    draggable: false,
  } // end options
  
  enemyOptions = {
    damage: 0,
  }
  
  
  // constructor
  // default constructor, copy constructor
  constructor(pos, parent = this) {
    this.targetpos = Vector.create(pos.x, pos.y)
    this.parent = (parent) ? ( parent.parent || this ) : this
  }
  
  
  // GET
  
  // position
  get position() {
    return (this.body) ? this.body.position : this.targetpos
  }
  get pos() {
    return this.position
  }
  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
  }
  
  // rotation
  get rotation() {
    return (this.body) ? this.body.angle : this.targetrot
  }
  get rot() {
    return this.rotation
  }
  get angle() {
    return this.rotation
  }
  get direction() {
    return this.targetrot
  }
  
  // other body stuff
  get velocity() {
    return this.body.velocity
  }
  
  // stat stuff
  get size() {
    return this.stat.size
  }
  get tier() {
    return this.stat.tier
  }
  get movespeed() {
    return this.stat.realspeed
  }
  get rotspeed() {
    return this.stat.realrot
  }
  
  // SET
  
  // go!
  
  // THE MAKE FUNCTION
  make(options = {}) {
    const o = options
    // parent: recursion!!!
    if (o.parent != null) {
      for (let p of o.parent) {
        if (typeof p === "string") {
          this.make(things[p])
        } else {
          this.make(p)
        }
      }
    }
    // matter.js stuff
    if (o.label != null) {
      this.label = o.label
    }
    if (o.type != null) {
      this.type = o.type
    }
    if (o.static != null) {
      this.static = o.static
    }
    if (o.isBullet != null) {
      this.isBullet = o.isBullet
    }
    if (o.category != null) {
      this.collisionFilter = o.category
    }
    // type stuff
    if (o.gametype != null) {
      this.gametype = o.gametype
    }
    // shape and display stuffs
    if (o.shape != null) {
      this.shape = o.shape
    }
    if (o.accessories != null) {
      this.accessories = o.accessories.slice()
    }
    if (o.render != null) {
      this.style.render = o.render
    }
    // game stuff (A LOT!)
    if (o.guns != null) {
      this.createGuns(o.guns)
    }
    if (o.controlType != null) {
      this.controlType = o.controlType
      this.controller.type = this.controlType
    }
    if (o.stat != null) {
      this.stat.make(o.stat)
    }
    if (o.xp != null) {
      this.xp = o.xp
      this.stat.refreshPoints()
    }
    if (o.bonusxp != null) {
      this.bonusxp = o.bonusxp
    }
    // this.options (some)
    if (o.drawable != null) {
      this.options.drawable = o.drawable
    }
    if (o.tickable != null) {
      this.options.tickable = o.tickable
    }
    if (o.active != null) {
      this.options.active = o.active
    }
    if (o.draggable != null) {
      this.options.draggable = o.draggable
    }
    if (o.drawLayer != null) {
      this.options.drawLayer = o.drawLayer
    }
    if (o.enemyDamage != null) {
      this.enemyOptions.damage = o.enemyDamage
    }
  }
  // the end of the MAKE FUNCTION
  
  // bundles up all the create functions into one main function, thing.create()
  create() {
    this.createShape()
    this.createBody()
    // this.createGuns() is already called in this.make(options)
    // add to [everything]
    everything.push(this)
    this.exists = true
  }
  
  // temporarily create (for Tower.draw())
  createTemp() {
    this.createShape()
    this.createBody(true)
  }
  
  // create SHAPE
  createShape() {
    const size = this.size
    switch (this.shape) {
      case "circle":
        this.shapeType = "circle"
        // do nothing
        break
      case "asteroid":
        // do stuff
        this.shapeType = "vertices"
        this.vertices = math.asteroid(10, size)
        break
    }
  }
  
  // create BODY (why am I capitalizing random words)
  createBody(temp = false) {
    if (this.body != null) {
      console.log("Body already exists! Removing body...")
      console.log(JSON.parse(JSON.stringify(this.body)))
      this.removeBody()
    }
    const s = this.stat,
          size = s.size,
          options = {
            isStatic: this.static,
            isBullet: this.isBullet,
            label: this.label,
            collisionFilter: this.collisionFilter,
            density: s.mass * 0.001,
            frictionAir: s.air * 0.01,
            friction: s.kineticFriction,
            frictionStatic: s.staticFriction,
          }
    if (this.style.render != null) {
      options.render = this.style.render
    }
    let b = null,
        x = this.targetpos.x,
        y = this.targetpos.y
    switch (this.shapeType) {
      case "circle":
        // do things
        b = Bodies.circle(x, y, size, options)
        break
      case "vertices":
        // do things
        b = Bodies.fromVertices(x, y, [this.vertices], options)
        if (b == null) {
          console.error("Body is bad!")
          console.log(this.vertices)
          b = Bodies.circle(x, y, size, options)        
        }
        break
      default:
        // do nothings
        console.error("Invalid thing shape type: " + this.shapeType + "!")
        break
    }
    b.gametype = this.gametype
    b.thing = this
    b.canDrag = this.options.draggable
    b.gravityScale = s.gravityScale
    // todo
    this.body = b
    if (!temp) {
      Composite.add(Thing.world, b)
    }
  }
  
  createGuns(guns) { // was (gunset, gunstat, options = { })
    if (this.guns.length > 0) {
      this.removeGuns()
    }
    this.addGuns(guns)
  }
  
  addGuns(guns) {
    for (let g of guns) {
      const gun = Gun.create(this, g)
      this.guns.push(gun)
    }
  }
  
  remove() {
    this.removeBody()
    this.removeGuns()
    if (this.gametype === "enemy") {
      this.removeEnemy()
    }
    // no this.removeShape() though
    // finally, remove from [everything]
    const index = everything.indexOf(this)
    if (index > -1) {
      everything.splice(index, 1)
    }
    // poof! everything's gone!
    // - me
    this.exists = false
  }
  
  removeBody() {
    if (this.body != null) {
      // remove from world
      Composite.remove(Thing.world, this.body)
      this.body = null
      return true
    } else {
      return false
    }
  }
  
  removeGuns() {
    for (let gun of this.guns) {
      gun.remove(false)
    }
    this.guns = [ ]
  }
  
  removeEnemy() {
    const index = enemies.indexOf(this)
    if (index > -1) {
      enemies.splice(index, 1)
    } else {
      if (this.controller.type == "enemy_menu") return
      console.error("Enemy to remove not found in 'enemies' list: ", this)
    }
  }
  
  // tick and refresh functions
  
  tick() {
    if (this.options.tickable && this.options.active) {
      if (this.controller != null) {
        this.controller.tick()
      }
      // tick body
      this.tickBody()
      // tick guns
      for (let g of this.guns) {
        g.tick()
      }
      if (this.effect != null) {
        this.effect.tick()
      }
    }
  }
  
  tickBody() {
    if (this.body == null) {
      return
    }
    Body.setAngle(this.body, math.lerpAngle(this.rotation, this.targetrot, this.rotspeed))
  }
  
  refreshLevel() {
    this.level = math.towerlevel(this.xp)
  }
  
  draw(render) {
    if (this.options.drawable && this.options.active) {
      // draw!
      // draw accessories 0
      this.drawAccessories(render, 0)
      this.drawThing(render)
      // draw accessories 1
      this.drawAccessories(render, 1)
      // draw guns
      for (let g of this.guns) {
        g.draw(render)
      }
      // draw accessories 2
      this.drawAccessories(render, 2)
      // draw effect
      this.effect.draw(render)
      // draw accessories 3
      this.drawAccessories(render, 3)
    }
  }
  
  drawThing(render) {
    const s = this.style.render,
          ctx = render.context
    if (s != null) {
      draw.setFill(ctx, s.fillStyle)
      draw.setStroke(ctx, s.strokeStyle)
      draw.setLineWidth(ctx, s.lineWidth)
      draw.setGlobalAlpha(ctx, s.opacity)
      this.drawShape(render) // draw the thing's shape! 
      draw.setGlobalAlpha(ctx, 1)
    }
  }
  
  drawShape(render, x = this.x, y = this.y, angle = this.rotation) {
    const shape = this.shape
    switch (this.shapeType) {
      case "circle":
        draw.circle(render, this.x, this.y, this.size)
        break
      case "vertices":
        // draw the thing's stored vertexes (ahem, vertices)
        const vertices = []
        for (let v of this.vertices) {
          vertices.push(Vector.create(v.x + x, v.y + y))
        }
        draw.polygon(render, vertices, angle) // then *fill* a polygon
        break
      default:
        break
    }
  }
  
  drawAccessories(render, layer) {
    for (let accessory of this.accessories) {
      if (accessory.layer === layer) {
        this.drawAccessory(render, accessory)
      }
    }
  }
  
  drawAccessory(render, accessory) {
    const ctx = render.context,
          a = accessory,
          type = a.type,
          size = a.size * this.size
    // style stuff
    let fill = "transparent",
        stroke = "transparent",
        lineWidth = 0,
        opacity = 1
    if (a.style != null) {
      fill = a.style.fill
      stroke = a.style.stroke
      lineWidth = a.style.lineWidth
      opacity = a.style.opacity
      draw.setFill(ctx, fill)
      draw.setStroke(ctx, stroke)
      draw.setLineWidth(ctx, lineWidth)
      draw.setGlobalAlpha(ctx, opacity)
    }
    switch (type) {
      case "guncircle":
        const gunIndex = (a.gunIndex || 0),
              gun = this.guns[gunIndex],
              centre = a.center || a.centre,
              gunsize = gun.stat.size * (a.size || 1)
        if (centre) {
          draw.circle(render, this.x, this.y, gunsize)
        } else {
          draw.circle(render, gun.x, gun.y, gunsize)
        }
        break
      case "none":
        break
      default:
        console.log("Unknown accessory type detected: ", a)
        break
    }
    draw.setGlobalAlpha(ctx, 1)
  }
  
  moveTo(targetPosition) {
    this.targetpos = Vector.copy(targetPosition)
  }
  
  moveBy(vec) {
    this.targetpos = Vector.add(this.targetpos, vec)
  }
  
  rotateTo(targetRotation) {
    this.targetrot = targetRotation
  }
  
  rotateBy(angle) {
    this.targetrot += angle
  }
  
  setSpeed(speed, direction) {
    if (speed !== 0) {
      const vel = Vector.mult(
              Vector.create( Math.cos(direction), Math.sin(direction) ),
              speed
            )
      this.body.initialVelocity = vel
      Body.setVelocity(this.body, vel)
    }
  }
  
  setOmega(speed) {
    if (speed !== 0) {
      Body.setAngularVelocity(this.body, math.degToRad(speed))
    }    
  }
  
  launchEnemy(speed) {
    // launch at a certain speed
    if (speed !== 0) {
      const tilt = (random.randreal() - 0.5) * 15, // 15 degrees tilt max
            down = Math.PI / 180 * (90 + tilt)
      this.setSpeed(speed, down)
      this.setOmega(Math.min(speed, 10))
    }    
  }
  
  addxp(add) {
    this.xp += add
    this.stat.refreshPoints()
  }
  
}
