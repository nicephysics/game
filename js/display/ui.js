import { draw } from "./draw.js"
import { style } from "./style.js"

import { Tower } from "../game/tower.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

export var ui = { }

ui.vars = {
  // constants
  xp_ball_radius: 15,
  xp_ball_font_size: 20,
  xp_bar_length: 300,
  // change
  xp_bar_ratio: 0,
}

ui.draw = function() {
  var v = ui.vars,
      render = Tower.render,
      ctx = render.context,
      player = Tower.player,
      _width = render.options.width,
      _height = render.options.height
  
  // bar var
  var xp = player.xp,
      level = player.level,
      current = xp - math.towerxp(level),
      next = math.towerxpneeded(level),
      ratio = math.lerp(v.xp_bar_ratio, current / next, 0.05),
      rBall = v.xp_ball_radius,
      x = _width - 30,
      y1 = _height / 2 - 150 - rBall * 2,
      y2 = y1 + 300,
      mid = y2 - ratio * 300,
      yBall = y2 + rBall
  ui.vars.xp_bar_ratio = ratio
  // draw! (remember to add ctx)
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
  // draw ball!
  draw.setDarkFill(ctx, "#ff801f")
  draw.setStroke(ctx, "transparent")
  draw.setFont(ctx, Math.floor(v.xp_ball_font_size) + "px Roboto")
  draw.textAlign(ctx, "center")
  draw._circle(ctx, x, yBall, rBall)
  draw._text(ctx, x, yBall, level + "")
}
