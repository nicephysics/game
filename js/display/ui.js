import { draw } from "./draw.js"
import { style } from "./style.js"

import { Tower } from "../game/tower.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

export var ui = { }

ui.vars = {
  // constants
  
  xp_bar_length_ratio: 0.50, // ratio of height
  xp_bar_side_x: 30,
  xp_bar_side_x_mouse: 60,
  xp_bar_color: "#ff801f",
  xp_bar_lerp: 0.05,
  
  xp_ball_radius: 15,
  xp_ball_font_size: 20,
  
  xp_text_font_size: 15,
  xp_text_appear_amount: 0.01,
  
  // change
  time: 0,
  
  xp_bar_xp: 0,
  xp_bar_show: 1,
  
  enemy_texts: [ ],
}

ui.draw = function() {
  var v = ui.vars,
      render = Tower.render,
      mousepos = render.mouse.absolute,
      ctx = render.context,
      player = Tower.player,
      playerX = player.x,
      playerY = player.y,
      _width = render.options.width,
      _height = render.options.height,
      x, y,
      size,
      width, height
      // define common variables first
  
  v.time++
  
  // bar vars
  var xp_show = v.xp_bar_show,
      xp = math.lerp(v.xp_bar_xp, player.xp, v.xp_bar_lerp),
      smoothing = ( Math.abs(player.xp - v.xp_bar_xp) >= v.xp_text_appear_amount ) // whether the UI is currently still smoothing
  if (xp_show > 0 || smoothing) {
    // more mars bars- no, bar vars
    var color = v.xp_bar_color,
        level = math.towerlevel(xp),
        current = xp - math.towerxp(level),
        next = math.towerxpneeded(level),
        ratio = current / next,
        rBall = v.xp_ball_radius,
        x = _width - v.xp_bar_side_x * xp_show
    height = v.xp_bar_length_ratio * _height
    var y1 = _height / 2 - height / 2 - rBall * 2,
        y2 = y1 + height,
        mid = y2 - ratio * height,
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
    draw.setFont(ctx, Math.floor(v.xp_ball_font_size) + "px Roboto Condensed")
    draw._circle(ctx, x, yBall - 2, rBall)
    draw.setLightFill(ctx, color)
    draw._text(ctx, x, yBall, level + "", "center")
    // check mouse!
    if (smoothing || ( mousepos.x > (_width - v.xp_bar_side_x_mouse) && mousepos.y > y1 && mousepos.y < yBall )) {
      draw.setFont(ctx, Math.floor(v.xp_text_font_size) + "px Roboto Condensed")
      draw.setDarkFill(ctx, color)
      draw._text(ctx, x - 15, mid, Math.round(current) + "/" + Math.round(next), 0, "right")
    }
  }
  
  // upgrade buttons
  
  // upgrade side
  
  // upgrade overlay
  
  // enemy texts
  var i = 0
  for (let t in v.enemy_texts.slice()) {
    x = t.x
    y = t.y
    size = t.size
    draw.setFill(ctx, t.fill || t.color || "transparent")
    draw.setStroke(ctx, t.stroke || "transparent")
    draw.setLineWidth(ctx, t.lineWidth || 1)
    draw.setFont(ctx, Math.floor(size) + "px Roboto Condensed")
    draw._text(ctx, x, y, t.text, t.angle, "center")
    if (t.time < v.time) {
      v.enemy_texts.splice(i, 1)
    }
    i++
  }
}
