
if (true) {
  // 2 space indent!
}

var Query = Matter.Query,
    Vector = Matter.Vector

export var math = { }

// e.g. lerp(start, end, 0) == start and lerp(start, end, 1) == end
math.lerp = function(start, end, factor) {
  return start * (1 - factor) + end * factor
}

math.lerpV = function(start, end, factor) {
  return Vector.create(
    math.lerp(start.x, end.x, factor),
    math.lerp(start.y, end.y, factor)
  )
}

// math lerpA?
math.lerpA = function(start, end, factor) {
  return Vector.angle(Vector.create(0, 0), math.lerpV(
    Vector.create(Math.cos(start), Math.sin(start)),
    Vector.create(Math.cos(end), Math.sin(end)),
    factor
  ))
}

math.lerpVector = math.lerpV
math.lerpAngle = math.lerpA
