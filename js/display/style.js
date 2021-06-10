/* this file creates render objects */

export var style = { }

style.fill = function(fillStyle, opacity = 1) {
  return {
    fillStyle: fillStyle,
    strokeStyle: "#000000",
    lineWidth: 1,
    opacity: opacity,
  }
}

style.stroke = function(strokeStyle, lineWidth = 1, opacity = 1) {
  return {
    fillStyle: "#00000000",
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

style.default = {
  ground: style.fill("#bd3900"),
}

style.tower = {
  basic: style.fill("#009ebd"),
  double: style.fill("#bd7500"),
}

style.gun = {
  
}
