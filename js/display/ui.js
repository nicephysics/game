import { draw } from "./draw.js"
import { style } from "./style.js"

import { Tower } from "../game/tower.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

export var ui = { }

ui.vars = {
  // constants
  
  xp_bar_length: 300,
  xp_bar_side_x: 30,
  xp_bar_side_x_mouse: 60,
  xp_bar_color: "#ff801f",
  xp_bar_lerp: 0.05,
  
  xp_ball_radius: 15,
  xp_ball_font_size: 20,
  
  xp_text_font_size: 15,
  xp_text_appear_amount: 0.01,
  
  // change
  xp_bar_xp: 0,
  // xp_bar_ratio: 0,
}

ui.draw = function() {
  var v = ui.vars,
      render = Tower.render,
      mousepos = render.mouse.absolute,
      ctx = render.context,
      player = Tower.player,
      _width = render.options.width,
      _height = render.options.height
  
  // bar var
  var color = v.xp_bar_color,
      xp = math.lerp(v.xp_bar_xp, player.xp, v.xp_bar_lerp),
      smoothing = ( Math.abs(player.xp - v.xp_bar_xp) >= v.xp_text_appear_amount ), // whether the UI is currently still smoothing
      level = math.towerlevel(xp),
      current = xp - math.towerxp(level),
      next = math.towerxpneeded(level),
      ratio = current / next,
      rBall = v.xp_ball_radius,
      x = _width - v.xp_bar_side_x,
      y = 0, // unused for bar var
      y1 = _height / 2 - 150 - rBall * 2,
      y2 = y1 + 300,
      mid = y2 - ratio * 300,
      yBall = y2 + rBall
  v.xp_bar_xp = xp
  // draw! (remember to add ctx)
  ctx.lineCap = 'round'
  draw.setFill(ctx, "transparent")
  draw.setLineWidth(ctx, 10)
  draw.setDarkStroke(ctx, color)
  draw._line(ctx, x, y1, x, y2)
  draw.setLineWidth(ctx, 8)
  draw.setLightStroke(ctx, color)
  draw._line(ctx, x, y1, x, y2)
  draw.setStroke(ctx, color)
  draw._line(ctx, x, mid, x, y2)
  // draw ball!
  draw.setDarkFill(ctx, color)
  draw.setStroke(ctx, "transparent")
  draw.setFont(ctx, Math.floor(v.xp_ball_font_size) + "px Roboto")
  draw._circle(ctx, x, yBall, rBall)
  draw.setLightFill(ctx, color)
  draw._text(ctx, x, yBall, level + "", "center")
  // check mouse!
  if (smoothing || ( mousepos.x > (_width - v.xp_bar_side_x_mouse) && mousepos.y > y1 && mousepos.x < yBall )) {
    draw.setFont(ctx, Math.floor(v.xp_text_font_size) + "px Roboto Condensed")
    draw.setDarkFill(ctx, color)
    draw._text(ctx, x - 5, mid, Math.round(current) + "/" + Math.round(next), "right")
  }
}
