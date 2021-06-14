import { category, config } from "../config/config.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"
import { PriorityQueue } from "../util/pq.js"

import { style } from "../display/style.js"
import { draw } from "../display/draw.js"

import { Tower } from "./tower.js"
import { wave } from "./wave.js"
import { Gun } from "./gun.js"
import { EnemyStat, enemystats } from "./enemystat.js"

export var enemies = [ ]

if (true) {
  // 2 space indent!
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
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
  
  static draw() {
    for (let e of enemies) {
      for (let g of e.guns) {
        g.draw(Tower.render)
      }
      e.draw(Tower.render)
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
  targetrot = 0
  controlType = "none"
  control = { }
  stat = new EnemyStat(this)
  guns = [ ]
  start = Enemy.spawn.random()
  exists = false
  // constructor
  constructor(type) {
    this.type = type
    this.init()
  }
  
  // get
  get position() {
    return this.body.position
  }
  get velocity() {
    return this.body.velocity
  }
  get size() {
    return this.stat.size
  }
  // returns the enemy body's current angle
  get rotation() {
    return this.body.angle
  }
  // alias for this.rotation
  get angle() {
    return this.body.angle
  }
  // alias for this.targetrot
  get direction() {
    return this.targetrot
  }
  
  // set
  
  // go!
  init() {
    this.initstats()
  }
  
  initstats() {
    this.stat.refresh()
    // old function
    /*
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
    */
  }
  
  tick() {
    this.doControl()
  }
  
  doControl() {
    switch (this.controlType) {
      case "aim_player":
        // aim at the player!
        Body.setAngle(this.body, math.lerpAngle(this.angle, this.targetrot, config.smooth.enemy.rot))
        this.targetrot = Vector.angle(this.position, Tower.player.position)
    }
  }
  
  draw(render) { // over
    
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
    this.body.gravityOff = true
    // launch at a certain speed
    if (s.speed !== 0) {
      var tilt = (random.randreal() - 0.5) * 5 // 5 degrees tilt max
      var down = Math.PI / 180 * (270 + tilt)
      Body.setVelocity(this.body, Vector.mult(
        Vector.create( Math.cos(down), Math.sin(down) ),
        s.speed
      ))
    }
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
  
  removeAllGuns() {
    for (let gun of this.guns) {
      gun.remove(false)
    }
    this.guns = [ ]
  }
  
  addGun(guntype) {
    var gun = Gun.create(this, guntype, "enemy")
    this.guns.push(gun)
    return gun
  }
  
  contemplationOfMortality() {
    
  }
}

// finally...
Enemy.init()
