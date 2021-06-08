var common = Matter.Common

export var random = { }

random.rand = common.random

random.randreal = function() {
  return common.random()
}

// inclusive
random.randint = function(start, end) {
  return common.random(start, end)
}
