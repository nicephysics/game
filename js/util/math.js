
export var math = { }

// e.g. lerp(start, end, 0) == start and lerp(start, end, 1) == end
math.lerp = function(start, end, factor) {
  return start * (1 - factor) + end * factor
}
