// imports
import { config, category } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { Thing } from "./thing.js"
import { things } from "./things.js"
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
  
  static time = 0
  
  /*
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
  */
  
  // fields
  // effect fields
  effects = [ ]
  type = "none"
  duration = 0
  strength = 0
  thing = null
  // storage fields
  
  // constructor
  constructor(thing, gametype) {
    // add to main list
    effects.push(this)
    this.thing = thing
  }
  
  // get
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
  
  // go!
  tick() {
    this.refreshEffects()
  }
  
  refreshEffects() {
    var i = 0,
        t = Effect.time
    for (let e of this.effects.slice()) {
      if (e.time <= t) {
        this.effects.splice(i, 1)
        if (e.antiafter) {
          var anti = {}
          anti.type = "anti" + e.type
          anti.duration = (e.antiafter > 0) ? e.antiafter : e.duration * -e.antiafter
          anti.time = Effect.time + anti.duration * config.FPS
          this.effects.push(anti)
        }
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
    const ctx = render.context,
    let type = e.type,
        duration = e.duration,
        time = e.time,
        // ratio of time left
        ratio = (e.time - Effect.time) / (duration * config.FPS),
        // bar properties
        barcolor = style.effect.barcolor[type],
        bardegrees = 360 * ratio,
        // draw properties
        x = this.thing.x,
        y = this.thing.y,
        size = this.thing.size
    // draw circular bar (arc)
    draw.setFill(ctx, "transparent")
    draw.setStroke(ctx, barcolor)
    draw.setLineWidth(ctx, 3)
    draw.arc(render, x, y, size * 1.2, math.degToRad(90), math.degToRad(90 + bardegrees), true)
    // todo
    switch (type) {
      case "stun":
        draw.setFillNoStroke(ctx, style.effect.overlay.stun)
        this.thing.drawShape(render)
    }
  }
  
  inflict(type, duration, options = { }) {
    if ( this.contains("anti" + type) ) return
    if ( type === "stun" && this.contains("stun") ) return
    var e = this.get(type)
    if (e) {
      e.duration += duration
      e.time += duration * config.FPS
      if (e.strength && options.strength) {
        e.strength = Math.max(e.strength, options.strength)
      }
      return
    } else {
      options.type = type
      options.duration = duration || 1
      options.time = Effect.time + duration * config.FPS
      this.effects.push(options)
      if (options.anti) {
        var anti = {}
        anti.type = "anti" + type
        anti.duration = (options.anti > 0) ? options.anti : duration * -options.anti
        anti.time = Effect.time + anti.duration * config.FPS
        this.effects.push(anti)
      }
      return
    }
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
