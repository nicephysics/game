import { category, config } from "../config/config.js"

import { math } from "../util/math.js"
import { PriorityQueue } from "../util/pq.js"
import { random } from "../util/random.js"

import { draw } from "../display/draw.js"
import { style } from "../display/style.js"
import { ui } from "../display/ui.js"

import { EnemyStat, enemystats } from "./enemystat.js"
import { Effect } from "./effect.js"
import { Gun } from "./gun.js"
import { Tower } from "./tower.js"
import { wave } from "./wave.js"

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
        case "Digit2":
          Enemy.sendwave(wave.make(["ballgun"], 1, { }), 1)
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
      for (let g of e.guns) {
        g.tick()
      }
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
    var render = Tower.render
    for (let e of enemies) {
      for (let g of e.guns) {
        g.draw(render)
      }
      e.effect.draw(render)
      e.draw(render)
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
  guns = [ ]
  start = Enemy.spawn.random()
  exists = false
  stat = new EnemyStat(this)
  effect = new Effect(this, "enemy")
  // constructor
  constructor(type) {
    this.type = type
    this.init()
  }
  
  // get
  get position() {
    return this.body.position
  }
  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
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
    this.tickCheck()
  }
  
  doControl() {
    switch (this.controlType) {
      case "aim_player":
        // aim at the player!
        Body.setAngle(this.body, math.lerpAngle(this.angle, this.targetrot, config.smooth.enemy.rot))
        this.targetrot = Vector.angle(this.position, Tower.player.position)
    }
  }
  
  tickCheck() {
    var remove_addXP = () => {
      var pos = Vector.sub(this.position, Vector.mult(Vector.normalise(this.velocity), 50)), // 50 pixels of velocity
          reward = this.stat.reward,
          color = "#b09f1c", // darkish yellow colour
          size = 13, // default font size 13
          time = 2, // default text time = 2 seconds
          mult = 1
      if (!this.body.hitByProjectile) {
        mult *= 2
        color = "#00ab17" // darkish green colour
        size += 3 // font size 16
        time += 1 // time = 3 seconds
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
      this.remove()
    }
    if (this.y < 0 && this.velocity.y <= 0) {
      remove_addXP()
    } else if (this.x < 0 && this.velocity.x <= 0 && this.velocity.y <= -this.velocity.x) {
      remove_addXP()
    } else if (this.x > Tower.render.options.width && this.velocity.x >= 0 && this.velocity.y <= this.velocity.x) {
      remove_addXP()
    }
  }
  
  draw(render) { // over
    
  }
  
  drawOverlay(render) {
    // todo
    // circle for now
    draw.circle(render, this.x, this.y, this.size)    
  }
  
  send() {
    this.exists = true
    this.createBody()
    enemies.push(this)
  }
  
  remove() {
    this.exists = false
    this.removeBody()
    this.removeAllGuns()
    const index = enemies.indexOf(this)
    if (index > -1) {
      enemies.splice(index, 1)
    } else {
      console.error("Enemy to remove not found in 'enemies' list: ", enemy)
    }
  }
  
  createBody() {
    var s = this.stat
    this.body = Bodies.circle(this.start.x, this.start.y, s.size, {
      isStatic: false,
      label: this.label,
      render: style.enemy[this.type],
      collisionFilter: category.enemy,
      density: s.mass * 0.001,
      frictionAir: s.air,
    })
    this.body.gametype = "enemy"
    this.body.enemy = this
    // launch at a certain speed
    if (s.speed !== 0) {
      var tilt = (random.randreal() - 0.5) * 15, // 15 degrees tilt max
          down = Math.PI / 180 * (90 + tilt),
          vel = Vector.mult(
            Vector.create( Math.cos(down), Math.sin(down) ),
            s.speed
          )
      this.body.initialVelocity = vel
      Body.setVelocity(this.body, vel)
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
  
  addGun(guntype, gunstat, options = { }) {
    var gun = Gun.create(this, guntype, "enemy")
    gun.setStatString(gunstat)
    this.guns.push(gun)
    return gun
  }
  
  contemplationOfMortality() {
    
  }
}

// finally...
Enemy.init()
