// ===== imports go here =====

// util
import { events } from "./util/events.js"
import { math } from "./util/math.js"
import { random } from "./util/random.js"
// display
import { style } from "./display/style.js"
import { display } from "./display/display.js"
import { navigation } from "./display/navigation.js"
import { ui } from "./display/ui.js"
// config
import { config, category } from "./config/config.js"
// game
import { collide } from "./game/collide.js"
import { controls } from "./game/controls.js"
import { Enemy } from "./game/enemy.js"
import { Thing } from "./game/thing.js"
import { things } from "./game/things.js"
import { ThingStat } from "./game/thingstat.js"
import { Tower } from "./game/tower.js"
import { gameupdate } from "./game/update.js"
import { waves } from "./game/waves.js"

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
    ground, atmosphere, leftwall, rightwall,
    _width = 0, // window width
    _height = 0, // window height
    _end_of_global_variables_ // the end

var addStuff = function() {
  ground = Bodies.rectangle(_width / 2, _height + 10, _width * 10, 60, {
    isStatic: true,
    collisionFilter: category.ground,
    label: "The Ground",
    render: style.default.ground,
  })
  ground.gametype = "ground"
  
  leftwall = Bodies.rectangle(-30, _height * 0.85 + 25, 60, _height + 50, {
    isStatic: true,
    collisionFilter: category.ground,
    label: "The Left Wall",
    render: style.default.wall,
  })
  leftwall.gametype = "wall"
  
  rightwall = Bodies.rectangle(_width + 30, _height * 0.85 + 25, 60, _height + 50, {
    isStatic: true,
    collisionFilter: category.ground,
    label: "The Right Wall",
    render: style.default.wall,
  })
  rightwall.gametype = "wall"
  
  atmosphere = Bodies.rectangle(_width / 2, _height * 0.85 + 25, _width + 50, _height + 50, {
    isStatic: true,
    isSensor: true,
    // collisionFilter: category.atmosphere,
    label: "The Atmosphere",
    render: style.default.atmosphere,
  })
  atmosphere.gametype = "atmosphere"
  
  Composite.add(world, [ atmosphere, ground, leftwall, rightwall ])
}

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
  // events.afterAdd(engine, function(compositeArray) {
  //     console.log("Added: ", compositeArray)
  // })
  
  addStuff()
    
  mouse = Mouse.create(canvas)
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
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
      background: '#28222e', // black purple space colour
      wireframes: false, // yes
      showMousePosition: false, // to display the mouse coords, see Mouse.create(canvas) above // disabled
    }
  })
  
  // INITIALIZE EVERYTHING
  // yes
  
  Thing.init(render)
  const player = new Thing(Vector.create(_width * 0.5, _height - 100))
  player.make(things.basic)
  player.rotateTo(random.angle())
  Tower.player = player
  
  navigation.init(render, mouseConstraint)
  
  collide.init(render)
  
  controls.init(render)
  
  gameupdate.init(render)
  
  ui.init(render)

  // run the renderer
  Render.run(render)

  // create runner
  var runner = Runner.create()

  // run the engine
  Runner.run(runner, engine)
  
  Thing.runner = runner
  
  // run waves
  waves.init("tut1")
}

window.addEventListener("load", function() {
    init()
})

window.addEventListener("resize", function() {
  _width = window.innerWidth
  _height = window.innerHeight
  // change render/canvas/bounds options
  render.options.width = _width
  render.options.height = _height
  render.canvas.style.width = _width
  render.canvas.style.height = _height
  render.canvas.width = _width
  render.canvas.height = _height
  render.bounds.max.x = _width
  render.bounds.max.y = _height
  
  // remove all stuff
  Composite.remove(world, [ atmosphere, ground, leftwall, rightwall ])
  // and then add them back
  addStuff()
  // basically an initialization again
  
  // also update config stuff
  config.updateBounds()  
})
