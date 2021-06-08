/* this file creates render objects */

export var display = { }

display.default = {
  ground: { fillStyle: "#bd3900" },
}

display.fill = function(fillStyle) {
  return { fillStyle: fillStyle }
}
