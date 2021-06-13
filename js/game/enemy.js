import { category, config } from "../config/config.js"

import { random } from "../util/random.js"
import { PriorityQueue } from "../util/pq.js"

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
    x: 0, y: -window.innerHeight / 5,
    w: window.innerWidth,
    h: window.innerHeight / 5,
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
          console.log(wave)
          Enemy.sendwave(wave.make(["ball"], 1, { }), 1)
          break
      }
    })
  }
  
  static spawn = {
    count: 0,
    queue: new PriorityQueue( // spawn queue
      // comparison
      (a, b) => { return a.time < b.time }
    ),
    bounds: getInitialSpawnBounds(),
    random: function() {
      var b = Enemy.spawn.bounds,
          ans = Vector.create(
            b.x + random.randreal() * b.w,
            b.y + random.randreal() * b.h
          )
      return ans
    }
  }
  
  static time = 0
  static tick() {
    Enemy.time++ // look above
    // tick all enemies
    for (let e of enemies) {
      e.tick()
    }
    // check spawn queue
    var q = Enemy.spawn.queue
    while (q.size() > 0 && q.peek().time < Enemy.time) {
      let item = q.peek()
      Enemy.send(item.type, item.options)
      q.pop()
    }
  }
  
  static send(type, options) {
    var e = new Enemy(type, options)
    e.send()
  }
  
  static sendNumber(type, number, sep, options = { }) {
    var q = Enemy.spawn.queue,
        time = Enemy.time
    for (let i = 0; i < number; i++) {
      time += sep * config.FPS
      q.push({
        time: time,
        type: type,
        options: options,
      })
    }
  }
  
  static sendwave(wavemaker, num) {
    var w = wavemaker.wave(num)
    if (w.count !== num) {
      console.error("Wave numbers don't match!", w, wavemaker)
    }
    Enemy.sendNumber(w.type, w.number, w.sep, {
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
    // other stats
    this.body.gravityScale = s.gravity
    if (s.inertia && s.inertia !== 1) {
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
  gravity: 1,
}

enemystats.ball = {
  mass: 0.1,
  size: 10,
  air: 0.05,
  gravity: 0.1,
}

// finally...
Enemy.init()
