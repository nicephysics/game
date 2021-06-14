// imports
import { events } from "../util/events.js"

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
          b.enemy.remove()
          console.log("Hit!")
        }
        break
        
      case "atmosphere":
        console.log("Start", tb)
        if (tb === "enemy" || tb === "bullet" || tb === "projectile") {
          b.gravityOff = false
        }
        break
        
      case "enemy":
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
        console.log("End", tb)
        if (tb === "enemy" || tb === "bullet" || tb === "projectile") {
          b.gravityOff = true
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
}
