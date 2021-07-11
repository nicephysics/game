import { config, category } from "../config/config.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

import { ui } from "../display/ui.js"

import { Thing } from "./thing.js"
import { things } from "./things.js"
import { Tower } from "./tower.js"

if (true) {
  // 2 space indent!
}

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Vector = Matter.Vector

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
      case "enemy_aim":
        this.tickEnemy("aim")
        break
      case "enemy_menu":
        this.tickEnemy("menu")
        break
      case "enemy_none":
      case "enemy":
        this.tickEnemy("none")
        break
      case "none":
        // do nothing!
        break
      default:
        console.error("Unknown controller type: ", this.type)
        break
    }
    // also: enemies
    if (this.type.startsWith("enemy")) {
      this.tickCheckEnemy()
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
    const speed = t.movespeed * (t.effect.speedmult || 0),
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
  
  tickEnemy(type) {
    // todo
    const t = this.thing,
          size = t.size
    switch (type) {
      case "aim":
        // aim at the player!
        Body.setAngle(t.body, math.lerpAngle(t.angle, t.targetrot, config.smooth.enemy.rot * t.stat.mult.enemyrot))
        t.targetrot = Vector.angle(t.position, Tower.player.position)
        break
      case "menu":
        // aim at the player!
        Body.setAngle(t.body, t.angle + math.degToRad(2))
        break
      case "none":
        // yes, NONE
        break
      default:
        console.error("Unknown enemy type: " + type)
        break
    }
  }
  
  tickCheckEnemy() {
    const t = this.thing,
          size = t.size,
          X = t.x,
          Y = t.y,
          v = t.velocity,
          screenWidth = Thing.render.options.width
    if (Y < size && v.y <= 0) {
      this.tickCheckEnemy_remove()
    } else if (X < size && v.x <= 0 && v.y <= -v.x) {
      this.tickCheckEnemy_remove()
    } else if (X > screenWidth + size && v.x >= 0 && v.y <= v.x) {
      this.tickCheckEnemy_remove()
    }
  }
  
  // to be used in the above method...
  tickCheckEnemy_remove() {
    const t = this.thing
    let pos = Vector.sub(t.position, Vector.mult(Vector.normalise(t.velocity), 50)), // 50 pixels of velocity
        bonusvel = Math.floor(Vector.magnitude(t.velocity)),
        reward = t.xp + Math.round( (t.bonusxp || 0) * bonusvel),
        color = "#b09f1c", // darkish yellow colour
        size = 13, // default font size 13
        time = 2, // default text time = 2 seconds
        mult = 1
    if (!t.body.hitByProjectile) {
      mult *= 2
      color = "#00ab17" // darkish green colour
      size += 3 // font size 16
      time += 1 // slightly longer text time = 3 seconds
    }
    ui.vars.enemy_texts.push({
      x: pos.x,
      y: pos.y,
      text: "+" + math.number(reward * mult),
      size: size,
      fill: color,
      stroke: "transparent",
      lineWidth: 0,
      angle: math.degToRad(random.randint(-15, 15)),
      time: ui.vars.time + time * config.FPS,
    })
    Tower.player.addxp(reward * mult)
    t.remove()    
  }
  
}
