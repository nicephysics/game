// imports
import { config, category } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

import { draw } from "../display/draw.js"
import { style } from "../display/style.js"

export var effects = [ ]

// effect types: slow, stun
export class Effect {
  // static
  static effects = effects
  
  static time = {}
  
  static tick = function() {
    Effect.time++
    for (let e of effects) {
      e.tick()
    }
  }
  
  static draw = function() {
    // draw effects
    for (let e of effects) {
      e.draw(Tower.render)
    }
  }
  
  // fields
  // effect fields
  effects = [ ]
  type = "none"
  duration = 0
  strength = 0
  // gametype fields
  gametype = "tower"
  tower = null
  enemy = null
  // storage fields
  
  // constructor
  constructor(object, gametype) {
    // add to main list
    effects.push(this)
    this.gametype = gametype
    this.object = object
  }
  
  // get
  get object() {
    switch (this.gametype) {
      case "tower":
        return this.tower
      case "enemy":
        return this.enemy
    }
  }
  get objectPos() {
    return this.object.position
  }
  get objectSize() {
    return this.object.size
  }
  get objectX() {
    return this.objectPos.x
  }
  get objectY() {
    return this.objectPos.y
  }
  get speedmult() {
    if (this.contains("stun")) {
      return 0
    }
    var freeze = this.get("freeze") || this.get("slow")
    if (freeze) {
      return (freeze.strength === -1) ? 0 : (1 / freeze.strength)
    }
    return 1
  }
  get canturn() {
    var stun = this.get("stun")
    if (stun && !stun.turn) {
      return false
    }
    return true
  }
  get canshoot() {
    var stun = this.get("stun")
    if (stun && !stun.shoot) {
      return false
    }
    return true
  }
  
  // set
  set object(o) {
    switch (this.gametype) {
      case "tower":
        this.tower = o
        break
      case "enemy":
        this.enemy = o
        break
    }
  }
  
  // go!
  tick() {
    this.refreshEffects()
  }
  
  refreshEffects() {
    var i = 0
    for (let e of this.effects.slice()) {
      if (e.time >= Effect.time) {
        this.effects.splice(i, 1)
      }
      ++i
    }
  }
  
  draw(render) {
    for (let e of this.effects) {
      this.drawEffect(render, e)
    }
  }
  
  drawEffect(render, e) {
    var ctx = render.context,
        // e.[thing]
        type = e.type,
        duration = e.duration,
        time = e.time,
        // ratio of time left
        ratio = (e.time - Effect.time) / duration * config.FPS,
        // bar properties
        barcolor = style.effect.barcolor[type],
        bardegrees = 360 * ratio,
        // draw properties
        x = this.objectX,
        y = this.objectY,
        size = this.objectSize
    // draw circular bar (arc)
    draw.setFill(ctx, "transparent")
    draw.setStroke(ctx, barcolor)
    draw.setLineWidth(ctx, 3)
    draw.arc(render, x, y, size + 5, math.degToRad(90), math.degToRad(90 + bardegrees), true)
    // todo
    switch (type) {
      case "stun":
        draw.setFill(ctx, style.effect.overlay.stun)
        draw.setStroke(ctx, "transparent")
        this.object.drawOverlay(render)
    }
  }
  
  inflict(type, duration, options = { }) {
    if (this.contains("anti" + type)) return
    var e = this.get(type)
    if (e) {
      e.duration += duration
      if (e.strength && options.strength) {
        e.strength = Math.max(e.strength, options.strength)
      }
    }
    options.type = type
    options.duration = duration || 1
    options.time = Effect.time + duration * config.FPS
    this.effects.push(options)
  }
  
  // contains...
  contains(type) {
    for (let e of this.effects) {
      if (e.type === type) {
        return true
      }
    }
    return false
  }
  
  // like contains above, but better
  get(type) {
    for (let e of this.effects) {
      if (e.type === type) {
        return e
      }
    }
    return false
  }
  
}
