import { events } from "../util/events.js"

var Bounds = Matter.Bounds,
    Events = Matter.Events, // not used?
    Mouse = Matter.Mouse,
    Vector = Matter.Vector

export var display_view = { }

display_view.mousedown = false
display_view.mousedownpos = null // Vector
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
      min: { x: -300, y: -300 },
      max: { x: _width + 300, y: _height },
      zoom: { min: 0.6, max: 1.5 },
  }
  
  // keep track of current bounds scale (view zoom)
  var boundsScale = {
    x: 1,
    y: 1,
    target: 1,
  }
  
  events.mousedown(mouseConstraint, function(mouse) {
    display_view.mousedown = true
    display_view.mousedownpos = mouse.absolute
  })
  
  events.mouseup(mouseConstraint, function(mouse) {
    display_view.mousedown = false
    display_view.mousedownpos = null
  })
  
  events.startdrag(mouseConstraint, function(body) {
    display_view.dragging = true
  })
  
  events.enddrag(mouseConstraint, function(body) {
    display_view.dragging = false
  })
  
  // render event listener (main function)
  events.beforeRender(render, function() {
    console.log(display_view.mousedown, display_view.dragging)
    if (display_view.mousedown) { console.log(display_view.mousedownpos) }
      
    var mouse = render.mouse,
        world = render.engine.world,
        translate
    
    var scaleFactor = mouse.wheelDelta * -0.1
    if (scaleFactor !== 0) {
      if ((scaleFactor < 0 && boundsScale.x >= limits.zoom.min) || (scaleFactor > 0 && boundsScale.x <= limits.zoom.max)) {
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
      // create a vector to translate the view, allowing the user to control view speed
      var mousepos = mouse.absolute
      
      translate = Vector.sub(display_view.mousedownpos, mousepos)

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
  }) // end events.beforeRender
} // end display_view.init
