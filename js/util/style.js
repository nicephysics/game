/* this file creates render objects */

export var style = { }

style.default = {
  ground: { fillStyle: "#bd3900" },
}

style.fill = function(fillStyle) {
  return { fillStyle: fillStyle }
}
