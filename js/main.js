// ===== imports go here =====

// util
import { events } from "./util/events.js"
import { util_world } from "./util/world.js"
// display
import { style } from "./display/style.js"
import { display } from "./display/display.js"
import { display_view } from "./display/view.js"
// config
import { config, category } from "./config/config.js"
// game
import { Tower } from "./game/tower.js"

if (true) {
  // realise that this file has two spaces as a tab
  1
}

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
    Vector = Matter.Vector,
    Bounds = Matter.Bounds,
    MouseConstraint = Matter.MouseConstraint,
    Detector = Matter.Detector, // ?
    canvas, // the canvas
    engine, // default engine
    world, // default world
    render, // default render
    mouse, // default mouse created from canvas
    mouseConstraint, // the mouse constraint
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
  engine.gravity.y = 1.0
    
  canvas = document.getElementById("canvas")
  _width = window.innerWidth
  _height = window.innerHeight
    
  canvas.width = _width
  canvas.height = _height
  
  // example event test
  events.afterAdd(engine, function(compositeArray) {
      console.log("Added: ", compositeArray)
  })
  
  var ground = Bodies.rectangle(_width / 2, _height + 10, _width * 10, 60, {
    isStatic: true,
    collisionFilter: category.ground,
    label: "The Ground",
    render: style.default.ground,
  })
  
  Composite.add(world, [ ground ])
    
  mouse = Mouse.create(canvas)
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true,
      },
    },
    collisionFilter: category.mouseConstraint,
  })
  Composite.add(world, mouseConstraint)
  
  // create the renderer
  render = Render.create({
    canvas: canvas,
    engine: engine,
    mouse: mouse,
    options: {
      width: _width,
      height: _height,
      hasBounds: true,
      pixelRatio: 1, // for now... TODO
      background: '#FAFAFA', // ok
      wireframes: false, // yes
      showMousePosition: true, // to display the mouse coords, see Mouse.create(canvas) above
    }
  })
  
  display_view.init(render, mouseConstraint)
  
  Tower.init(render)
  var tower = new Tower()
  
  events.afterRender(render, function() {
    Tower.tickAll()
    Tower.drawAll()
  })

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
