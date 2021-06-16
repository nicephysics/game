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
  
  health_heart_side_x: 25,
  health_heart_side_y: 20,
  health_heart_size: 20,
  health_text_size: 20,
  
  // change
  time: 0,
  click: false,
  hover: { x: 0, y: 0 },
  
  xp_bar_xp: 0,
  xp_bar_show: 1,
  
  enemy_texts: [ ],
}

ui.init = function(render) {
  var v = ui.vars,
      render = Tower.render,
      mouse = render.mouse,
      ctx = render.context
  // basically a click
  window.addEventListener("mousemove", function(event) {
    v.hover = mouse.absolute
  })
  window.addEventListener("mouseup", function(event) {
    v.click = mouse.absolute
  })
  // .
}

ui.tick = function() {
  var v = ui.vars,
      render = Tower.render,
      ctx = render.context
  // tick time!
  v.time++
  // that's all?
}

ui.tickAfter = function() {
  var v = ui.vars,
      render = Tower.render,
      ctx = render.context
  // clear click
  v.click = false
  // how about hover?
}

ui.draw = function() {
  var v = ui.vars,
      render = Tower.render,
      mousepos = render.mouse.absolute,
      clickpos = v.click || { x: -1000, y: -1000 },
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
  
  // tick!
  ui.tick()
  
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
    draw._text(ctx, x, yBall, level + "", 0, "center")
    // check mouse!
    if (smoothing || ( mousepos.x > (_width - v.xp_bar_side_x_mouse * xp_show) && mousepos.y > y1 - 10 && mousepos.y < y2 )) {
      draw.setFont(ctx, Math.floor(v.xp_text_font_size) + "px Roboto Condensed")
      draw.setDarkFill(ctx, color)
      draw._text(ctx, x - 15, mid, math.number(current) + "/" + math.number(next), 0, "right")
    }
    if (mousepos.x > (_width - v.xp_bar_side_x_mouse * xp_show) && mousepos.y > yBall - rBall && mousepos.y < yBall + rBall) {
      draw.setFont(ctx, Math.floor(v.xp_text_font_size) + "px Roboto Condensed")
      draw.setDarkFill(ctx, color)
      draw._text(ctx, x - rBall - 15, yBall, "Level " + Math.round(level), 0, "right")
    }
  }
  
  // planet health
  var health = Tower.health
  x = _width - v.health_heart_side_x
  y = _height - 20 - v.health_heart_side_y
  size = v.health_heart_size
  draw.setFill(ctx, "#cc0000")
  draw.setStroke(ctx, "transparent")
  draw._heart(ctx, x, y, size, size)
  draw.setFill(ctx, "#662c2c")
  draw.setFont(ctx, Math.floor(v.health_text_size) + "px Roboto")
  draw._text(ctx, x - 15, y - 2, health + "", 0, "right")
  
  // upgrade buttons
  
  // upgrade side
  
  // upgrade overlay
  
  // enemy texts
  var i = 0
  for (let t of v.enemy_texts.slice()) {
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
  
  // tick after...
  ui.tickAfter()
}
