import { events } from "../util/events.js"

if (true) {
  // 2 spaces!
}

var Bounds = Matter.Bounds,
    Events = Matter.Events, // not used?
    Mouse = Matter.Mouse,
    Vector = Matter.Vector

export var display_view = { }

display_view.mousedown = false
display_view.mousepos = Vector.create(0, 0) // Vector
display_view.mousedelta = Vector.create(0, 0) // Vector
display_view.dragging = false
display_view.panning = function() {
  return display_view.mousedown && !display_view.dragging
}

// needs render and mouse constraint, in that order
display_view.init = function(
  render,
  mouseConstraint
) {
  // MOUSE TEST
  var _width = render.options.width
  var _height = render.options.height

  // create limits for the viewport
  var limits = {
      min: { x: _width * -6.0, y: -300 },
      max: { x: _width * 6.0, y: _height },
      zoom: { min: 1.0, max: 1.0 },
  }
  
  // keep track of current bounds scale (view zoom)
  var boundsScale = {
    x: 1,
    y: 1,
    target: 1,
  }
  
  // right click = pan
  document.body.addEventListener('mousedown', (event) => {
    if (event.buttons & 2 > 0) {
      display_view.mousedown = true
      event.preventDefault()
      console.log(event.buttons)
    }
  }, false)
  
  events.mousedown(mouseConstraint, function(mouse) {
    // display_view.mousedown = true
  })
  
  events.mouseup(mouseConstraint, function(mouse) {
    display_view.mousedown = false
  })
  
  events.startdrag(mouseConstraint, function(body) {
    display_view.dragging = true
  })
  
  events.enddrag(mouseConstraint, function(body) {
    display_view.dragging = false
  })
  
  // render event listener (main function)
  events.beforeRender(render, function() {      
    var mouse = render.mouse,
        mousepos = mouse.absolute,
        world = render.engine.world,
        translate
    
    var scaleFactor = mouse.wheelDelta * -0.1
    if (scaleFactor !== 0) {
      if ((scaleFactor < 0 && boundsScale.x > limits.zoom.min) || (scaleFactor > 0 && boundsScale.x < limits.zoom.max)) {
        boundsScale.target += scaleFactor
      }
    }
    
    if (Math.abs(boundsScale.x - boundsScale.target) > 0.002) {
      // smoothly tween scale factor
      scaleFactor = (boundsScale.target - boundsScale.x) * 0.2
      boundsScale.x += scaleFactor
      boundsScale.y += scaleFactor

      // scale the render bounds
      render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
      render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

      // translate so zoom is from centre of view
      translate = {
        x: render.options.width * scaleFactor * -0.5,
        y: render.options.height * scaleFactor * -0.5
      }

      Bounds.translate(render.bounds, translate)

      // update mouse
      Mouse.setScale(mouse, boundsScale)
      Mouse.setOffset(mouse, render.bounds.min)
    } // end zooming
    
    if (display_view.panning()) {
      // get the vector to translate the view      
      translate = Vector.clone(display_view.mousedelta)
      
      // prevent the view moving outside the extents
      if (render.bounds.min.x + translate.x < limits.min.x)
          translate.x = limits.min.x - render.bounds.min.x

      if (render.bounds.max.x + translate.x > limits.max.x)
          translate.x = limits.max.x - render.bounds.max.x

      if (render.bounds.min.y + translate.y < limits.min.y)
          translate.y = limits.min.y - render.bounds.min.y

      if (render.bounds.max.y + translate.y > limits.max.y)
          translate.y = limits.max.y - render.bounds.max.y

      // move the view
      Bounds.translate(render.bounds, translate)

      // we must update the mouse too
      Mouse.setOffset(mouse, render.bounds.min)
    } // end panning
    
    display_view.mousedelta = Vector.sub(display_view.mousepos, mousepos)
    display_view.mousepos = Vector.clone(mousepos)
  }) // end events.beforeRender
} // end display_view.init
