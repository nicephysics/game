import { category, config } from "../config/config.js"

import { random } from "../util/random.js"
import { style } from "../display/style.js"
import { draw } from "../display/draw.js"

import { Tower } from "./tower.js"
import { wave } from "./wave.js"

export var enemystats = { }

export var enemies = [ ]

if (true) {
  // 2 space indent
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector

var getInitialSpawnBounds = function() {
  return {
    x: 0, y: -window.innerHeight,
    w: window.innerWidth,
    h: window.innerHeight,
  }
}

export class Enemy {
  // static
  static stats = enemystats
  static enemies = enemies
  
  static init = function() {
    document.addEventListener("keydown", function(event) {
      switch (event.code) {
        case "Digit1":
          Enemy.wave(wave.make(["ball"], 1, { }), 1)
      }
    })
  }
  
  static spawn = {
    count: 0,
    bounds: getInitialSpawnBounds(),
    random: function() {
      var b = Enemy.spawn.bounds
      var ans = Vector.create(
        b.x + random.randreal() * b.w,
        b.y + random.randreal() * b.h
      )
      console.log(ans)
      return ans
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
      console.error("Wave numbers don't match!", w, wavemaker)
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
    this.init()
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
      console.error("Enemy to remove not found in 'enemies' list: ", enemy)
    }
  }
  
  createBody() {
    var s = this.stat
    this.body = Bodies.circle(this.start.x, this.start.y, s.size, {
      isStatic: false,
      label: this.label,
      style: style.enemy[this.type],
      collisionFilter: category.enemy,
      density: s.mass * 0.001,
      frictionAir: s.air,
    })
    this.body.gametype = "enemy"
    this.body.enemy = this
    if (s.inertia && s.inertia !== 0) {
      Body.setInertia(this.body, this.body.inertia * s.inertia)
    }
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

// finally...
Enemy.init()
