var Events = Matter.Events,
    Composite = Matter.Composite

var setGravity = function(engine, x, y) {
  engine.gravity.x = x
  engine.gravity.y = y
}

// don't use this though?
var addToWorld = function(world, bodies) {
  Composite.add(world, bodies)
}

var getAllBodies = function(world) {
  return Composite.allBodies(world);
}
