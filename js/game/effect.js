import { Tower } from "./tower.js"
import { Enemy } from "./enemy.js"

export var effects = [ ]

// effect types: slow, stun
export class Effect {
  // static
  static effects = effects
  static draw = function() {
    // draw effects
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
  
  // constructor
  constructor(object, gametype) {
    // 
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
  get objectSize() {
    return this.object.size
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
    
  }
  
  draw(render) {
    for (let e of this.effects) {
      this.drawEffect(render, e)
    }
  }
  
  drawEffect(render, e) {
    var ctx = render.context
    // todo
  }
  
  inflict(type, duration, options = { }) {
    options.type = type
    options.duration = duration
    this.effects.push(options)
  }
}
