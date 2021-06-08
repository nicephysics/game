// ===== imports go here =====

// util
import { events } from "./util/events.js"
import { world } from "./util/world.js"
import { display } from "./util/display.js"

// matter.js module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Detector = Matter.Detector, // ?
    canvas, // the canvas
    engine, // default engine
    world, // default world
    _width = 0, // window width
    _height = 0, // window height
    _end_of_global_variables_ // the end

// called on window load
var init = function() {
  // create the engine
  engine = Engine.create()
  world = engine.world
  
  // set gravity
  engine.gravity.x = 0
  engine.gravity.y = 0.001
    
  canvas = document.getElementById("canvas")
  _width = window.innerWidth
  _height = window.innerHeight
    
  canvas.width = _width
  canvas.height = _height
  
  // create a renderer
  var render = Render.create({
    canvas: canvas,
    engine: engine,
    mouse: Mouse.create(canvas),
    options: {
      width: _width,
      height: _height,
      pixelRatio: 1, // for now... TODO
      background: '#FAFAFA', // ok
      wireframes: false, // yes
      showMousePosition: true, // ?
    }
  })
  
  // an example of using composite events on the world
  Events.on(world, 'afterAdd', function(event) {
      var composite = event.object // not confirmed whether it is a composite
      console.log(composite)
  })
  
  var ground = Bodies.rectangle(_width / 2, _height + 10, _width + 10, 60, { isStatic: true, render: display.default.ground })
  Composite.add(world, [ ground ])

  // run the renderer
  Render.run(render)

  // create runner
  var runner = Runner.create()

  // run the engine
  Runner.run(runner, engine)
}

window.addEventListener("load", function() {
    init()
})
