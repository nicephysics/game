import { category, config } from "../config/config.js"

import { math } from "../util/math.js"
import { PriorityQueue } from "../util/pq.js"
import { random } from "../util/random.js"

import { draw } from "../display/draw.js"
import { style } from "../display/style.js"
import { ui } from "../display/ui.js"

import { Effect } from "./effect.js"
import { Gun } from "./gun.js"
import { Thing } from "./thing.js"
import { things } from "./things.js"
import { ThingStat } from "./thingstat.js"
import { Tower } from "./tower.js"
import { wave } from "./wave.js"

export var enemies = [ ]

if (true) {
  // 2 space indent!
}

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Vector = Matter.Vector

const getSpawnBounds = function(size) {
  return {
    x: size * 1.2,
    y: -size * 2,
    w: window.innerWidth - size * 1.2,
    h: size,
  }
}

export class Enemy {
  // static
  static enemies = enemies
  static enemyTypes = []
  static randomEnemyTypes = []
  
  static init = function() {
    // send shortcuts
    document.addEventListener("keydown", function(event) {
      switch (event.code) {
        case "Digit1":
          Enemy.sendwavemaker(wave.make(["ball"], 1, { }), 1)
          break
        case "Digit2":
          Enemy.sendwavemaker(wave.make(["ballgun"], 1, { }), 1)
          break
        case "Digit3":
          Enemy.sendwavemaker(wave.make(["asteroid"], 1, { }), 1)
          break
      }
    })
    // enemy types
    for (let k in things) {
      if (  things[k].gametype === "enemy" ||
           (Array.isArray(things[k].parent) && things[k].parent.includes("enemy"))
         ) {
        Enemy.enemyTypes.push(k)
        if (things[k].enemy_random === true) {
          Enemy.randomEnemyTypes.push(k)
        }
      }
    }
  }
  
  static randomEnemy = function() {
    return things[random.choose(Enemy.randomEnemyTypes)]
  }
  
  static spawn = {
    count: 0,
    queue: new PriorityQueue( // spawn queue
      // comparison
      (a, b) => { return a.time < b.time }
    ),
    random: function(size) {
      const b = getSpawnBounds(size), // bounds
            ans = Vector.create(
              b.x + random.randreal() * b.w,
              b.y + random.randreal() * b.h
            )
      return ans
    }
  }
  
  static waveOn = function() {
    return (enemies.length > 0 || Enemy.spawn.queue.size() > 0)
  }
  
  static time = 0
  static tick() {
    Enemy.time++
    // no need to tick all enemies anymore
    // check spawn queue
    const q = Enemy.spawn.queue
    while (q.size() > 0 && q.peek().time < Enemy.time) {
      let item = q.peek()
      Enemy.send(item.type, item.options)
      q.pop()
    }
  }
  
  // for drawEnemy and redrawEnemy
  static drawEnemies = {} // basically a Map<String, Thing>
  
  static drawEnemy(render, x, y, size, type, options) {
    let e = Enemy.drawEnemies[type],
        s = style.enemy[type]
    const ctx = render.context,
          mousepos = render.mouse.absolute,
          time = ui.vars.time
    x -= render.bounds.min.x
    y -= render.bounds.min.y
    if (!e) {
      e = new Thing(Vector.create(x, y))
      e.make(things[type])
      e.stat.make({ size: size })
      e.createTemp()
      Enemy.drawEnemies[type] = e
    }
    e.body.position = Vector.create(x, y)
    e.body.angle += math.degToRad(1)
    // draw enemy
    e.draw(render)
    return e
  }
  
  static redrawEnemy(type, options = null) {
    let e = Enemy.drawEnemies[type]
    if (e) {
      e.createShape()
      return e
    } else {
      return null
    }
  }
  
  static send(type, options) {
    const make = things[type],
          size = make.stat.size,
          e = new Thing(Enemy.spawn.random(size))
    e.make(make)
    e.stat.makeMult(options)
    e.create()
    enemies.push(e)
    
    const b = e.body,
          s = e.stat
    if (s.speed !== 0) {
      const tilt = (random.randreal() - 0.5) * 2, // 2 degrees tilt max
            dir = math.degToRad(90 + tilt),
            vel = Vector.mult(
              Vector.create( Math.cos(dir), Math.sin(dir) ),
              s.speed * s.mult.speed
            )
      b.direction = dir
      b.initialVelocity = vel
      Body.setVelocity(b, vel)
    }
    /*
    var e = new Enemy(type, options)
    e.createShape()
    e.send()
    */
  }
  
  static sendNumber(type, number, sep, options = { }) {
    var q = Enemy.spawn.queue,
        time = Enemy.time
    for (let i = 0; i < number; i++) {
      q.push({
        time: time,
        type: type,
        options: options,
      })
      time += sep * config.FPS
    }
  }
  
  static sendwave(w) {
    const type = w.type || w.t || "asteroid",
          num = w.number || w.n || 1,
          sep = w.sep || w.s || 1
    Enemy.sendNumber(type, num, sep, w) // options
  }
  
  static sendwavemaker(wavemaker, num) {
    var w = wavemaker.wave(num)
    if (w.count !== num) {
      console.error("Wave numbers don't match!", w, wavemaker)
    }
    Enemy.sendNumber(w.type, w.number, w.sep, {
      difficulty: w.difficulty,
      rand: w.rand,
    })
  }
}

// finally...
Enemy.init()
