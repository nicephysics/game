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
