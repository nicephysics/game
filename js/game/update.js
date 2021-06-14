import { category, config } from "../config/config.js"

import { events } from "../util/events.js"

import { Tower } from "./tower.js"
import { Enemy } from "./enemy.js"

export var gameupdate = { }

if (true) {
  // 2 space indent!
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector

gameupdate.init = function(render) {
  
  var engine = render.engine,
      mouse = render.mouse,
      world = engine.world
  
  events.afterRender(render, function() {
    Tower.tickAll()
    Tower.drawAll()
    Enemy.tick()
  })
  
  events.beforeUpdate(engine, function(engine) {
    var all = Composite.allBodies(engine.world)
    var gravity = engine.gravity
    for (let body of all) {
      // 1. gravity scale/off
      if (body.gravityOff) {
        Body.applyForce(body, body.position, {
          x: gravity.x * 1 * gravity.scale * body.mass,
          y: gravity.y * 1 * gravity.scale * body.mass
        })
      } else {
        let gravityScale = (body.gravityScale == null) ? 1 : body.gravityScale
        if (gravityScale === 1) continue;
        let scale = gravityScale - 1
        Body.applyForce(body, body.position, {
          x: gravity.x * scale * gravity.scale * body.mass,
          y: gravity.y * scale * gravity.scale * body.mass
        })
      }
      // 2. disabled velocity
      if (body.disableVelocity) {
        Body.setVelocity(body, Vector.create(0, 0))
      }
      // 3. can drag?
      // 4. others?
    }
  })
  
}
