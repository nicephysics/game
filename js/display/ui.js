import { draw } from "./draw.js"
import { style } from "./style.js"

import { Tower } from "../game/tower.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

export var ui = { }

ui.draw = function() {
  var render = Tower.render,
      ctx = render.context,
      player = Tower.player,
      _width = render.options.width,
      _height = render.options.height
  
  // bar
  var xp = player.xp,
      level = player.level,
      current = xp - math.towerxp(level),
      next = math.towerxpneeded(level),
      ratio = current / next,
      x = _width - 30,
      y1 = _height / 2 - 150,
      y2 = _height / 2 + 150,
      mid = _height / 2 + 150 - ratio * 300
  // draw!
  ctx.lineCap = 'round'
  draw.setFill(ctx, "transparent")
  draw.setLineWidth(ctx, 10)
  draw.setDarkStroke(ctx, "#ff801f")
  draw._line(ctx, x, y1, x, y2)
  draw.setLineWidth(ctx, 8)
  draw.setLightStroke(ctx, "#ff801f")
  draw._line(ctx, x, y1, x, y2)
  draw.setStroke(ctx, "#ff801f")
  draw._line(ctx, x, mid, x, y2)
}
