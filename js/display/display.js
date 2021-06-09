var Render = Matter.Render

export var display = { }

display.camera = { }

// this(center_x, center_y, _width, _height)
display.camera.rect = function(render, x, y, w, h) {
  Render.lookAt(render, {
    min: { x: x - w / 2, y: y - h / 2 },
    max: { x: x + w / 2, y: y + h / 2 }
  })
}
