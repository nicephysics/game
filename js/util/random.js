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


// implementation
random.random_seed_generator = (function(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
  h = h << 13 | h >>> 19;
  return function() {
      h = Math.imul(h ^ h >>> 16, 2246822507);
      h = Math.imul(h ^ h >>> 13, 3266489909);
      return (h ^= h >>> 16) >>> 0;
  }
})("phyzicz");

random.seed = function() {
  return random.random_seed_generator()
}

random.function128 = function(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

random.function32 = function(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/*
How to use:

var seed = random.seed() // for storage...
var rand = random.fun(seed) // ok
rand(); rand(); rand(); // call random many times...

*/
random.fun = function(seed) {
  return random.function32(seed)
}
