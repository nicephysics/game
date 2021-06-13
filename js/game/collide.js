// imports
import { events } from "../util/events.js"

if (true) {
  // 2 space indent!
}

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector

export var collide = { }

collide.init = function(render) {
  var engine = render.engine,
      mouse = render.mouse,
      world = engine.world
  
  // the main function
  function collide(a, b) {
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
        
      case "enemy":
        break
        
      default:
        break
    }
  }
  
  events.collisionStart(engine, function(pairs) {
    for (let pair of pairs) {
      var a = pair.bodyA
      var b = pair.bodyB
      collide(a, b)
      collide(b, a)
    }
  })
}
