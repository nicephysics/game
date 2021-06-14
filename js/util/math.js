
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

math.pow = Math.pow
math.floor = Math.floor
math.ceil = Math.ceil
math.pi = Math.PI // not a function!
math.powersum = function(power, n, mult = 1) {
  return mult * ( (Math.pow(n + 1, power) - 1) / (power - 1) )
}

// towerxp(2) = total xp needed to reach level 2
math.towerxp = function(level) {
  return 25 * (level - 1) * (level + 2)
}

// towerxpneeded(1) = xp needed to go from level 1 to 2
math.towerxpneeded = function(currentlevel) {
  return math.towerxp(currentlevel + 1) - math.towerxp(currentlevel)
}

// towerlevel(100) = level you are at when you have 100 xp
math.towerlevel = function(xp) {
  return Math.floor( (Math.sqrt(225 + xp * 4) - 5) / 10 )
}

// ok...
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value)
  }
  value = +value
  exp = +exp
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }
  // Shift
  value = value.toString().split('e')
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
  // Shift back
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
}

math.roundBy = function(value, exp) {
  return decimalAdjust('round', value, exp)
}
math.floorBy = function(value, exp) {
  return decimalAdjust('floor', value, exp)
}
math.ceilBy = function(value, exp) {
  return decimalAdjust('ceil', value, exp)
}
