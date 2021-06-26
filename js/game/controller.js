import { config, category } from "../config/config.js"

import { Thing } from "./thing.js"
import { things } from "./things.js"

export class Controller {
  // static
  
  // fields
  type = "none"
  thing = null
  
  // constructor
  constructor(thing) {
    this.thing = thing
  }
  
  // get
  get ctrl() {
    return this.thing.control
  }
  
  // set
  
  // go!
  tick() {
    switch (this.type) {
      case "player":
        this.tickPlayer()
        break
      case "enemy":
        this.tickEnemy()
        break
      case "none":
        // do nothing!
        break
      default:
        console.error("Unknown controller type: ", this.type)
        break
    }
  }
  
  tickPlayer() {
    // todo
    const t = this.thing,
          size = t.size
    Body.setPosition(t.body, math.lerpVector(t.position, t.targetpos, config.smooth.tower.pos))
    // do control
    let c = t.control,
        movedir = Vector.create(0, 0)
    // move direction
    if (c.up) movedir.y--
    if (c.down) movedir.y++
    if (c.left) movedir.x--
    if (c.right) movedir.x++
    // move variables
    var speed = t.movespeed * (t.effect.speedmult || 0),
        moveVector = Vector.mult(Vector.normalise(movedir), speed),
        moveResult = Vector.add(t.targetpos, moveVector)
    // move limits
    if (moveResult.x - size < config.movelimits.min.x) moveResult.x = config.movelimits.min.x + size
    if (moveResult.y - size < config.movelimits.min.y) moveResult.y = config.movelimits.min.y + size
    if (moveResult.x + size > config.movelimits.max.x) moveResult.x = config.movelimits.max.x - size
    if (moveResult.y + size > config.movelimits.max.y) moveResult.y = config.movelimits.max.y - size
    // move!
    t.targetpos = moveResult
    // rotate!
    if (t.effect.canturn) {
      if (c.autorotate) {
        t.targetrot += 0.015
      } else {
        t.targetrot = Vector.angle(t.position, c.pointer)
      }
    }
  }
  
  tickEnemy() {
    // todo
  }
}
