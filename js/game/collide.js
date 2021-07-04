// imports
import { events } from "../util/events.js"

import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"

if (true) {
  // 2 space indent!
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Vector = Matter.Vector

export var collide = { }

collide.init = function(render) {
  var engine = render.engine,
      mouse = render.mouse,
      world = engine.world
  
  // the main function
  function collideStart(a, b) {
    var ta = a.gametype,
        tb = b.gametype
    // type a switch
    switch (ta) {
      case "ground":
        if (tb === "enemy") {
          b.remove()
          Tower.health -= b.enemy.stat.damage
        }
        if (tb === "bullet" || tb === "projectile") {
          b.remove()
          b.gun.removeChild(b)
        }
        break
        
      case "atmosphere":
        if (tb === "enemy" || tb === "bullet" || tb === "projectile") {
          b.gravityOff = false
          if (b.frictionAir === 0) {
            b.frictionAir = b.frictionAirPrev || 0
          }
        }
        break
        
      case "projectile":
      case "bullet":
        // effect
        if (a.effect && a.effect.type !== "none") {
          var e = a.effect,
              momentumA = Vector.mult(a.velocity, a.mass),
              momentumB = Vector.mult(b.velocity, b.mass),
              relative = Vector.sub(momentumA, momentumB)
          // unused: relative momentum for collision effects
          if (tb === "tower") {
            b.effect.inflict(e.type, e.duration, e)
          } else if (tb === "enemy") {
            b.effect.inflict(e.type, e.duration, e)
          }
        }
        break
        
      case "enemy":
        if (tb === "projectile") {
          a.hitByProjectile = true
        }
        break
        
      default:
        break
    }
  }
  
  // end function
  function collideEnd(a, b) {
    var ta = a.gametype,
        tb = b.gametype
    switch (ta) {
      case "atmosphere":
        if (tb === "enemy" || tb === "bullet" || tb === "projectile") {
          b.gravityOff = true
          b.frictionAirPrev = b.frictionAir
          b.frictionAir = 0
        }
        break
    }
  }
  
  events.collisionStart(engine, function(pairs) {
    for (let pair of pairs) {
      var a = pair.bodyA
      var b = pair.bodyB
      collideStart(a, b)
      collideStart(b, a)
    }
  })
  
  events.collisionEnd(engine, function(pairs) {
    for (let pair of pairs) {
      var a = pair.bodyA
      var b = pair.bodyB
      collideEnd(a, b)
      collideEnd(b, a)
    }
  })
  
  events.afterAdd(engine, function(compositeArray) {
    function doStuff(composite) {
      var body = composite,
          tb = body.gametype
      // switch statement
      switch (tb) {
        case "enemy":
        case "bullet":
        case "projectile":
          body.gravityOff = true
          body.frictionAirPrev = body.frictionAir
          body.frictionAir = 0
          break
      }
    }
    if (compositeArray instanceof Array) {
      // for loop #1
      for (let composite of compositeArray) {
        doStuff(composite)
      }
    } else {
      doStuff(compositeArray)
    }
  })
}
