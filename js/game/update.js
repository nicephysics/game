import { category, config } from "../config/config.js"

import { events } from "../util/events.js"

import { ui } from "../display/ui.js"

import { Tower } from "./tower.js"
import { Enemy } from "./enemy.js"
import { Effect } from "./effect.js"

export var gameupdate = { }

if (true) {
  // 2 space indent!
}

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Engine = Matter.Engine,
      Vector = Matter.Vector

gameupdate.init = function(render) {
  
  const engine = render.engine,
        mouse = render.mouse,
        world = engine.world
  
  function loop() {
    if (Tower.runner.enabled) {
      Engine.update(engine, 1000 / 60)
    } else {
      Engine.update(engine, 0)
    }
  }
  
  let interval = setInterval(loop, 1000 / 60)
  
  function tickALL() {
    Tower.tickAll()
    Enemy.tick()
    Effect.tick()    
  }
  
  function drawALL() {
    Tower.drawAll()
    Enemy.draw()
    Effect.draw()
    // then draw GUI overlay
    ui.draw()
  }
  
  events.afterRender(render, function() {
    drawALL()
  })
  
  events.beforeUpdate(engine, function(engine) {
    tickALL()
    var all = Composite.allBodies(engine.world)
    var gravity = engine.gravity
    for (let body of all) {
      // 1. gravity scale/off
      if (body.gravityOff) {
        Body.applyForce(body, body.position, {
          x: gravity.x * -1 * gravity.scale * body.mass,
          y: gravity.y * -1 * gravity.scale * body.mass
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
