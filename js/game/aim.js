export var aim = {
  // indent is 2 spaces
}

var Vector = Matter.Vector

// aim! credits: https://math.stackexchange.com/questions/1792507/finding-launch-angle-for-two-projectile-collision
aim.aim = function(position, velocity, targetPosition, targetVelocity, targetTime, gravity) {
  function s(a) { // square
    return a * a
  }
  var px = position.x,
      py = position.y,
      tx = targetPosition.x,
      ty = targetPosition.y,
      x = tx - px,
      y = ty - py,
      sx = s(x),
      sy = s(y),
      u = velocity,
      su = s(u),
      v = Vector.magnitude(targetVelocity),
      sv = Vector.magnitudeSquared(targetVelocity),
      a = Vector.angle(Vector.create(0, 0), targetVelocity),
      t = targetTime,
      st = s(t),
      g = gravity,
      sg = s(g),
      sin = Math.sin(a),
      cos = Math.cos(a),
      sr = Math.sqrt,
      max = Math.max,
      min = Math.min,
      atan2 = Math.atan2,
      zzz = s(sin)*sv+2*g*y
  if (zzz < 0) return false
  var tz = sin*v/g+sr(zzz)/g-t
  if (tz < 0) return false
  var tmin = max(0,(x-cos*t*v)/(cos*v-u)),
      tmax = min(tz,(x-cos*t*v)/(cos*v))
  if (tmin > tmax) return false
  //var d = 2*(sg*st-2*v*g*t*sin+sv+su),
  //    q = v*(3*g*st-2*y)*sin+2*v*x*cos-t*(sg*st-2*g*y+2*v),
  //    s = st*(sg*st*su-4*sg*sx-4*g*su*y+4*su*sv)+4*(su*sx+su*sy-sv*sx) + 4*t*v*x*(sg*st+2*g*y-2*su)*cos-sv*(g*st*2*x+2*y)*(g*st-2*x+2*y)*s(cos) - 4*sv*x*(g*st+2*y)*cos*sin-4*v*t(g*st*su-2*g*sx-2*su*y)*sin
      
  var s = t*t*(g*g*t*t*u*u - 4*g*g*x*x - 4*g*u*u*y+4*u*u*v*v)+4*u*u*x*x+4*u*u*y*y-4*v*v*x*x + cos*4*t*v*x*(g*g*t*t+2*g*y-2*u*u) - cos*cos*v*v*(g*t*t+2*x+2*y)*(g*t*t-2*x+2*y) - cos*sin*4*v*v*x*(g*t*t+2*y) - sin*4*v*t*(g*t*t*u*u-2*g*x*x-2*u*u*y),
      d = 2*(g*g*t*t - 2*v*sin*g*t - u*u + v*v),
      q = sin*v*(3*g*t*t - 2*y) + 2*cos*v*x - t*(g*g*t*t - 2*g*y + 2*v*v)
  if (s < 0 || d === 0) return false
  var t1 = (q + sr(s)) / d,
      t2 = (q - sr(s)) / d,
      ti
  if (t1 >= tmin && t1 <= tmax && t2 >= tmin && t2 <= tmax) {
    ti = min(t1, t2)
  } else if (t1 >= tmin && t1 <= tmax) {
    ti = t1
  } else if (t2 >= tmin && t2 <= tmax) {
    ti = t2
  } else {
    return false
  }
  var c = (x-cos*v*(t+ti))/(ti*u)
  if (c <= 0.0 || c >= 1.0) return false
  var ta = atan2(sr(1-c*c), c)
  console.log(ti, a)
  return a
}

aim.aim(Vector.create(0, 0), 120, Vector.create(1000, 30), Vector.mult(Vector.create(-Math.cos(Math.PI/6), Math.sin(Math.PI/6)), 100), 5, 9.81)

