// ===== imports go here =====

// util
import { math } from "../util/math.js"
import { random } from "../util/random.js"
// display
import { style } from "../display/style.js"
import { display } from "../display/display.js"
import { navigation } from "../display/navigation.js"
import { ui } from "../display/ui.js"
// config
import { config, category } from "../config/config.js"
// game
import { collide } from "./collide.js"
import { controls } from "./controls.js"
import { Enemy, enemies } from "./enemy.js"
import { Game } from "./game.js"
import { Thing } from "./thing.js"
import { things } from "./things.js"
import { ThingStat } from "./thingstat.js"
import { Tower } from "./tower.js"
import { gameupdate } from "./update.js"
import { waves } from "./waves.js"

if (true) {
  // 2 space indent!
}

const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Composite = Matter.Composite,
      Vector = Matter.Vector,
      Bounds = Matter.Bounds
let canvas, // the canvas
    engine, // default engine
    world, // default world
    render, // default render
    mouse, // default mouse created from canvas
    mouseConstraint, // the mouse constraint
    ground, atmosphere, leftwall, rightwall, // game stuff
    _width = 0, // window width
    _height = 0 // window height

// initialize the WHOLE GAME
export const game_init = function() {
  // create the engine
  engine = Engine.create()
  world = engine.world
  
  // set gravity
  engine.gravity.x = 0
  engine.gravity.y = 1.0
  
  // canvas, width, height
  canvas = document.getElementById("canvas")
  _width = window.innerWidth
  _height = window.innerHeight
    
  canvas.width = _width
  canvas.height = _height
  
  // add mouse constraint
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

  // run the renderer
  Render.run(render)

  // create runner
  const runner = Runner.create()

  // run the engine
  Runner.run(runner, engine)
  
  Thing.init(render)
  
  navigation.init(render, mouseConstraint)
  
  collide.init(render)
  
  gameupdate.init(render)
  
  ui.init(render)
}

const addGameThings = function() {
  if (Game.mode === "game") {
    ground = Bodies.rectangle(_width / 2, _height + 10, _width * 10, 60, {
      isStatic: true,
      collisionFilter: category.ground,
      label: "The Ground",
      render: style.default.ground,
    })
    ground.gametype = "ground"
  } else {
    ground = undefined
  }
  
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
  
  for (let thing of [ atmosphere, ground, leftwall, rightwall ]) {
    if (thing != null) {
      Composite.add(world, thing)
    }
  }
}

const removeGameThings = function() {
  for (let thing of [ atmosphere, ground, leftwall, rightwall ]) {
    if (thing != null) {
      Composite.remove(world, thing)
    }
  }
}

const refreshGameThings = function() {
  removeGameThings()
  addGameThings()
}

let dropEnemyInterval = null
const dropEnemy = function() {
  if (!ui.focused) {
    return
  }
  let x = random.randreal(0, _width),
      y = random.randreal(-50, -100)
  const enemy = new Thing(Vector.create(x, y))
  enemy.make(Enemy.randomEnemy())
  enemy.make( { controlType: "enemy_menu" } )
  enemy.create()
  enemies.push(enemy)
  const dir = math.degToRad(90),
        vel = Vector.mult(
          Vector.create( Math.cos(dir), Math.sin(dir) ),
          8
        )
  enemy.body.direction = dir
  enemy.body.initialVelocity = vel
  Body.setVelocity(enemy.body, vel)
}

// called at the start of a game in the game
export const game_start = function(name) {
  // add game things
  refreshGameThings()
  
  // add the player!
  const player = new Thing(Vector.create(_width * 0.5, _height - 100))
  player.make(things.basic)
  player.create()
  player.rotateTo(random.angle())
  Tower.player = player
  
  // initialize controls too
  controls.init(render)
  
  // initialize waves...
  waves.init(name)
  
  // remove menu enemy drop
  clearInterval(dropEnemyInterval)
}

// called when the menu is opened
export const game_menu = function() {
  Game.mode = "menu"
  // remove the game walls and add menu walls
  refreshGameThings()
  // remove player and other Things
  if (Tower.player) {
    Composite.remove(world, [ Tower.player ])
  }
  dropEnemyInterval = setInterval(dropEnemy, 250)
}

// called whenever the window is resized
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
  
  if (Game.mode === "game") {
    // remove all game things
    removeGameThings()
    // and then add them back
    addGameThings()
  } else if (Game.mode === "menu") {
    // remove all game things
    removeMenuThings()
    // and then add them back
    addMenuThings()
  }
  // basically an initialization again
  
  // also update config stuff
  config.updateBounds()  
})
