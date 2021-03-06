// no imports, yay

var Vector = Matter.Vector

export const math = { }

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

math.degToRad = function(degrees) {
  return ((degrees + 360) % 360) / 180 * Math.PI
}

math.radToDeg = function(radians) {
  return ((radians / Math.PI * 180) + 360) % 360
}

math.angleVector = function(angle = 0, magnitude = 1) {
  return Vector.create(magnitude * Math.cos(angle), magnitude * Math.sin(angle))
}

math.pow = Math.pow
math.floor = Math.floor
math.ceil = Math.ceil
math.pi = Math.PI // not a function!
math.powersum = function(power, n, mult = 1) {
  return mult * ( (Math.pow(n + 1, power) - 1) / (power - 1) )
}

math.max = Math.max
math.min = Math.min
math.bound = function(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

math.rand = Math.random

math.randreal = function(low, high) {
  return Math.random() * (high - low) + low;
}

math.randint = function(low, high) {
  low = Math.ceil(low);
  high = Math.floor(high);
  return Math.floor(Math.random() * (high - low) + low);
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

math.asteroid = function(sides, size) {
  const pointset = [],
        ans = []
  for (let i = 0; i < sides; i++) {
    let angle = (360 / sides * i) + ( math.randreal(-0.5, 0.5) * 180 / sides ),
        dist = math.randreal(0.75, 1.15) * size,
        v = math.angleVector(math.degToRad((angle + 360) % 360), dist)
    pointset.push([v.x, v.y])
  }
  const pts = hull(pointset, 10000000000000000000)
  if (pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
    // always true, in fact
    pts.splice(0, 1)
  }
  for (let xy of pts) {
    ans.push(Vector.create(xy[0], xy[1]))
  }
  return ans
}

math.regpoly = function(sides, size, angle = 0, x = 0, y = 0) {
  const ans = []
  let a = angle
  size *= math.getRealSize(sides)
  for (let i = 0; i < sides; ++i) {
    ans.push(Vector.create(x + size * Math.cos(a), y + size * Math.sin(a)))
    a += Math.PI * 2 / sides;
  }
  return ans
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

math.sf = function(number, sf) {
  return +(number.toPrecision(sf)) // parseFloat(...) or Number(...) should work too!
}

math.log = function(a, b = 10) {
  return Math.log(a) / Math.log(b)
}

math.prefixes = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"]

math.number = function(number) {
  number = Math.round(+number)
  if (number < 1000) return "" + number
  if (number < 0) return "-" + math.number(-number)
  var log = Math.floor(Math.log10(number) / 3)
  return ( math.sf(number, 3) / Math.pow(1000, log) ) + " " + math.prefixes[log]
}

// thanks for the code!
const regpolySizes = (() => {
  const o = [1, 1, 1]; 
  for (let sides = 3; sides < 16; sides++) {
    // We say that the real size of a 0-gon, 1-gon, 2-gon is one, then push the real sizes of triangles, squares, etc...
    o.push(
      Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides)))
    );
  }
  return o;
})();

math.getRealSize = function(sides) {
  if (sides >= regpolySizes.length) {
    return 1;
  } else if (Math.floor(sides) == sides) {
    return regpolySizes[sides];
  } else {
    return Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides)))
  }
}