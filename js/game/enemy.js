import { category, config } from "../config/config.js"

import { random } from "../util/random.js"
import { style } from "../display/style.js"
import { draw } from "../display/draw.js"

import { Tower } from "./tower.js"

export var enemystats = { }

export var enemies = [ ]

if (true) {
  // 2 space indent
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector,

function getInitialSpawnBounds() {
  return {
    x: 0, y: window.innerHeight,
    w: window.innerWidth,
    h: window.innerHeight,
  }
}

export class Enemy {
  // static
  static stats = enemystats
  static enemies = enemies
  
  static spawn = {
    count: 0,
    bounds: getInitialSpawnBounds(),
    random: function() {
      var b = Enemy.spawn.bounds
      return Vector.create(
        b.x + random.randreal() * b.w,
        b.y + random.randreal() * b.h
      )
    }
  }
  
  static send(type, options) {
    var e = new Enemy(type, options)
    e.send()
  }
  
  static sendNumber(type, number, options) {
    for (let i = 0; i < number; i++) {
      Enemy.send(type, options)
    }
  }
  
  static wave(wavemaker, num) {
    var w = wavemaker.wave(num)
    if (w.count !== num) {
      console.err("Wave numbers don't match!", w, wavemaker)
    }
    Enemy.sendNumber(w.type, w.number, {
      difficulty: w.difficulty,
      rand: w.rand,
    })
  }
  
  // fields
  id = Enemy.spawn.count++
  label = "Enemy #" + this.id
  body = null // Matter.Body
  type = "ball"
  stat = null // object for options
  start = Enemy.spawn.random()
  exists = false
  // constructor
  constructor(type, options = { }) {
    this.type = type
    this.stat = options
  }
  
  // get
  get position() {
    return this.body.position
  }
  get velocity() {
    return this.body.velocity
  }
  
  // set
  
  // go!
  init() {
    var s = enemystats[this.type]
    for (let k in s) {
      this.stat[k] = s[k]
    }
    var base = enemystats.base
    for (let k in base) {
      this.stat[k] = (this.stat[k] || 1) * base[k]
    }
    switch (this.type) {
      case "ball":    
        this.stat.mass *= this.stat.difficulty || 1
    }
  }
  
  tick() {
    
  }
  
  draw() { // over
    
  }
  
  send() {
    this.exists = true
    this.createBody()
    enemies.push(this)
  }
  
  remove() {
    this.exists = false
    this.removeBody()
    const index = enemies.indexOf(this);
    if (index > -1) {
      enemies.splice(index, 1);
    } else {
      console.err("Enemy to remove not found in 'enemies' list: ", enemy)
    }
  }
  
  createBody() {
    this.body = Bodies.circle(this.start.x, this.start.y, this.stat.size, {
      isStatic: true,
      label: this.label,
      style: style.enemy[this.type],
      collisionFilter: category.badBullet,
      density: this.stat.mass * 0.001,
      frictionAir: this.stat.air,
    })
    Body.setInertia(this.body, this.body.inertia * (this.stat.inertia || 1))
    Composite.add(Tower.world, this.body)
  }
  
  removeBody() {
    if (!this.body) return
    Composite.remove(Tower.world, this.body)
    this.body = null
  }
  
  contemplationOfMortality() {
    
  }
}

enemystats.base = {
  mass: 1,
  size: 1,
  air: 1,
  inertia: 1,
}

enemystats.ball = {
  mass: 0.5,
  size: 15,
  air: 0.05,
  inertia: 0, // unused?
}
