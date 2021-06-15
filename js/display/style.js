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
  basic: style.fillStroke("#009ebd"),
  double: style.fillStroke("#bd7500"),
}

style.projectile = {
  bullet: style.fillStroke("#a7a7af"),
}

style.enemy = {
  ball: style.fillStroke("#b56275"),
}

// non-matter styles

style.gun = {
  basic: "#62a7b5",
  double: "#c29d61",
  ballgun: "#d47d94",
}

style.effect = {
  barcolor: {
    stun: "#21313b",
    freeze: "#59bfff",
    slow: "#733d00",
  },
}
