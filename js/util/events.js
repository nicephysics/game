var Events = Matter.Events

export var events = { }

// input_function(compositeArray) { for (let composite of compositeArray) { ... } }
events.afterAdd = function(engine, input_function) {
  Events.on(engine.world, 'afterAdd', function(event) {
    input_function(event.object)
  })
}

// input_function(engine) { engine }
events.beforeUpdate = function(engine, input_function) {
  Events.on(engine, 'beforeUpdate', function(event) {
    input_function(event.source)
  })
}

// input_function(pairs) { pairs[i].bodyA; pairs[i].bodyB }
events.collisionStart = function(engine, input_function) {
  Events.on(engine, 'collisionStart', function(event) {
    input_function(event.pairs)
  })
}

// input_function(pairs) { pairs[i].bodyA; pairs[i].bodyB }
events.collisionActive = function(engine, input_function) {
  Events.on(engine, 'collisionActive', function(event) {
    input_function(event.pairs)
  })
}

// input_function(pairs) { pairs[i].bodyA; pairs[i].bodyB }
events.collisionEnd = function(engine, input_function) {
  Events.on(engine, 'collisionEnd', function(event) {
    input_function(event.pairs)
  })
}

/* RENDER EVENTS */

// input_function() { ... }
events.beforeRender = function(render, input_function) {
  Events.on(render, "beforeRender", function(event) {
    input_function()
  })
}

// input_function() { ... }
events.afterRender = function(render, input_function) {
  Events.on(render, "afterRender", function(event) {
    input_function()
  })
}

// input_function(mouse) { ... }
events.mousedown = function(mouseConstraint, input_function) {
  Events.on(mouseConstraint, "mousedown", function(event) {
    input_function(event.mouse)
  })
}


// input_function(mouse) { ... }
events.mousemove = function(mouseConstraint, input_function) {
  Events.on(mouseConstraint, "mousemove", function(event) {
    input_function(event.mouse)
  })
}

// input_function(mouse) { ... }
events.mouseup = function(mouseConstraint, input_function) {
  Events.on(mouseConstraint, "mouseup", function(event) {
    input_function(event.mouse)
  })
}

// input_function(body) { ... }
events.startdrag = function(mouseConstraint, input_function) {
  Events.on(mouseConstraint, "startdrag", function(event) {
    input_function(event.body)
  })
}

// input_function(body) { ... }
events.enddrag = function(mouseConstraint, input_function) {
  Events.on(mouseConstraint, "enddrag", function(event) {
    input_function(event.body)
  })
}
