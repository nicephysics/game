// ===== imports go here =====

// util
import { events } from "./util/events.js"
import { util_world } from "./util/world.js"
import { display } from "./util/display.js"
import { style } from "./util/style.js"

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
  engine.gravity.y = 0.001
    
  canvas = document.getElementById("canvas")
  _width = window.innerWidth
  _height = window.innerHeight
    
  canvas.width = _width
  canvas.height = _height
  
  // example event test
  events.afterAdd(engine, function(compositeArray) {
      console.log("Added: ", compositeArray)
  })
  
  var ground = Bodies.rectangle(_width / 2, _height + 10, _width + 10, 60, { isStatic: true, label: "Ground", render: style.default.ground })
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
  
  // MOUSE TEST
  
  // keep track of current bounds scale (view zoom)
  var boundsScale = {
    x: 1,
    y: 1,
    target: 1,
  };
  
  // render event listener
  events.beforeRender(render, function() {
    console.log(boundsScale)
      
    var mouse = render.mouse,
        world = render.engine.world,
        translate
    
    var scaleFactor = mouse.wheelDelta * -0.1;
    if (scaleFactor !== 0) {
      if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
        boundsScale.target += scaleFactor;
      }
    }
    
    if (Math.abs(boundsScale.x - boundsScale.target) > 0.01) {
      // smoothly tween scale factor
      scaleFactor = (boundsScale.target - boundsScale.x) * 0.2;
      boundsScale.x += scaleFactor;
      boundsScale.y += scaleFactor;

      // scale the render bounds
      render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
      render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

      // translate so zoom is from centre of view
      translate = {
        x: render.options.width * scaleFactor * -0.5,
        y: render.options.height * scaleFactor * -0.5
      };

      Bounds.translate(render.bounds, translate);

      // update mouse
      Mouse.setScale(mouse, boundsScale);
      Mouse.setOffset(mouse, render.bounds.min);
    }
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
