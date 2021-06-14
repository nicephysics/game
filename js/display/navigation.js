// imports
import { events } from "../util/events.js"
import { math } from "../util/math.js"

import { category, config } from "../config/config.js"

if (true) {
  // 2 space indent!
}

var Body = Matter.Body,
    Bounds = Matter.Bounds,
    Composite = Matter.Composite,
    Events = Matter.Events, // not used?
    Mouse = Matter.Mouse,
    Query = Matter.Query,
    Vector = Matter.Vector

export var navigation = { }

navigation.mousedown = true
navigation.rightmousedown = false
navigation.leftmousedown = false
navigation.mousepos = Vector.create(0, 0) // Vector
navigation.mousedelta = Vector.create(0, 0) // Vector
navigation.dragging = false
navigation.spacepressed = false
navigation.panning = function() {
  return (navigation.rightmousedown && !navigation.dragging) || (navigation.leftmousedown && navigation.spacepressed)
}
navigation.pulling = function() {
  return navigation.leftmousedown && !navigation.spacepressed
}

// needs render and mouse constraint, in that order
navigation.init = function(
  render,
  mouseConstraint
) {
  // MOUSE TEST
  var _width = render.options.width,
      _height = render.options.height,
      mouse = render.mouse,
      world = render.engine.world        

  // create limits for the viewport
  var limits = config.limits
  
  // keep track of current bounds scale (view zoom)
  var boundsScale = {
    x: 1,
    y: 1,
    target: 1,
  }
  
  var pulledBody = null
  
  // right click = pan
  document.addEventListener("mousedown", function(event) {
    // check which mouse button pressed
    if ((event.buttons & 2) > 0) {
      // right mouse button pressed
      navigation.rightmousedown = true
      navigation.leftmousedown = false
      pulledBody = null
      event.preventDefault()
    } else if ((event.buttons & 1) > 0) {
      // left mouse button pressed
      if (!navigation.leftmousedown) {
        var bodies = Query.point(Composite.allBodies(world), mouse.position)
        pulledBody = null
        for (let body of bodies) {
          if (body && body.canDrag) {
            pulledBody = body
          }
        }
      }
      navigation.leftmousedown = true
      navigation.rightmousedown = false
    } else {
      navigation.rightmousedown = false
      navigation.leftmousedown = false
      pulledBody = null
    }
  })
  
  document.addEventListener("keydown", function(event) {
    switch (event.code) {
      case "Space":
        navigation.spacepressed = true
    }
  })
  
  document.addEventListener("keyup", function(event) {
    switch (event.code) {
      case "Space":
        navigation.spacepressed = false
    }
  })
  
  events.mousedown(mouseConstraint, function(mouse) {
    // nothing here for now
  })
  
  events.mouseup(mouseConstraint, function(mouse) {
    navigation.rightmousedown = false
    navigation.leftmousedown = false
    pulledBody = null
  })
  
  events.startdrag(mouseConstraint, function(body) {
    navigation.dragging = true
  })
  
  events.enddrag(mouseConstraint, function(body) {
    navigation.dragging = false
  })
  
  // render event listener (main function)
  events.beforeRender(render, function() {
    var mousepos = mouse.absolute,
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
    
    if (navigation.panning()) {
      // get the vector to translate the view      
      translate = Vector.clone(navigation.mousedelta)
      
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
    
    if (navigation.pulling() && pulledBody && pulledBody.canDrag) {
      var translate = Vector.neg(Vector.clone(navigation.mousedelta))
      if (pulledBody.gametype === "tower") {
        pulledBody.tower.moveByVector(translate)
      } else {
        Body.translate(pulledBody, translate)
      }
    } // end pulling
    
    navigation.mousedelta = Vector.sub(navigation.mousepos, mousepos)
    navigation.mousepos = Vector.clone(mousepos)
    
  }) // end events.beforeRender
} // end navigation.init
