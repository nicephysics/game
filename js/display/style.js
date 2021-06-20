/* this file creates render objects */

export var style = { }

style.fillStroke = function(fillStyle, opacity = 1, lineWidth = 3) {
  return {
    fillStyle: fillStyle,
    strokeStyle: chroma(fillStyle).darken().hex(),
    lineWidth: lineWidth,
    opacity: opacity,
  }
}

style.fill = function(fillStyle, opacity = 1) {
  return {
    fillStyle: fillStyle,
    strokeStyle: "transparent",
    lineWidth: 0,
    opacity: opacity,
  }
}

style.stroke = function(strokeStyle, lineWidth = 1, opacity = 1) {
  return {
    fillStyle: "transparent", // transparent, hopefully
    strokeStyle: strokeStyle,
    lineWidth: lineWidth,
    opacity: opacity,
  }
}

style.sprite = function(texturePath, xOffset = 0.5, yOffset = 0.5, xScale = 1.0, yScale = 1.0) {
  return {
    sprite: {
      texture: texturePath,
      xOffset: xOffset,
      yOffset: yOffset,
      xScale: xScale,
      yScale: yScale,
    }
  }
}

// matter styles

style.default = {
  ground: style.fillStroke("#005fbd", 1, 0),
  wall: style.fillStroke("#bd3900", 1, 0),
  atmosphere: style.fillStroke("#c87dd4", 0.3, 5),
  /* {
    strokeStyle: "#554fff",
    lineWidth: 5,
    fillStyle: "#dac6d0",
    opacity: 1,
  } */
}

style.tower = {
  basic: style.fillStroke("#00bd8e"),
  double: style.fillStroke("#009ebd"),
  twin: style.fillStroke("#009ebd"),
  big: style.fillStroke("#009ebd"),
  strong: style.fillStroke("#009ebd"),
  fast: style.fillStroke("#009ebd"),
  // double: style.fillStroke("#bd7500"),
}

style.projectile = {
  bullet: style.fillStroke("#a7a7af"), // grey (gun colour)
}

style.bullet = {
  bullet: style.fillStroke("#446987"), // dark blue (blast colour)
}

style.enemy = {
  ball: style.fillStroke("#b56275"),
  ballgun: style.fillStroke("#822909"),
  asteroid: style.fillStroke("#706060"),
}

// non-matter styles

style.gun = {
  basic: "#62b59d",
  double: "#62a7b5",
  twin: "#62a7b5",
  big: "#62a7b5",
  strong: "#62a7b5",
  fast: "#62a7b5",
  // double: "#c29d61",
  ballgun: "#d47d94",
}

style.effect = {
  barcolor: {
    stun: "#5d8096",
    freeze: "#59bfff",
    slow: "#733d00",
    antistun: "#fcffab",
    antifreeze: "#d8ff9e",
  },
  overlay: {
    stun: "#38536355",
    freeze: "#91d5ff77",
    antistun: "transparent",
    antifreeze: "transparent",
  }
}

style.upgradetext = [
  "#d674ba", // projectile size
  "#d67474", // projectile mass
  "#d6b974", // projectile launch speed
  "#a5d674", // projectile launch rate
  "#74d6ce", // tower movement speed
  "#ad74d6", // projectile launch spread
  "#748bd6", // projectile drag
  "#ac74d6", // tower rotation speed
  // some more...
]
