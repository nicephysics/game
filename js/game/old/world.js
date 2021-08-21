var Events = Matter.Events,
    Composite = Matter.Composite

export var util_world = { }

// this(engine, x, y)
util_world.gravity = function(engine, x, y) {
  engine.gravity.x = x
  engine.gravity.y = y
}

// don't use this though?
util_world.add = function(world, bodies) {
  Composite.add(world, bodies)
}

// this(world)
util_world.all = function(world) {
  return Composite.allBodies(world);
}
