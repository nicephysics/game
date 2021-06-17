import { draw } from "./draw.js"
import { style } from "./style.js"

import { Tower } from "../game/tower.js"
import { controls } from "../game/controls.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

export var ui = { }

if (true) {
  // 2 space indent!
}

const Common = Matter.Common,
      Vector = Matter.Vector

ui.vars = {
  // constants
  
  xp_bar_length_ratio: 0.50, // ratio of height
  xp_bar_side_x: 30,
  xp_bar_side_x_mouse: 60,
  xp_bar_color: "#ff801f",
  
  xp_ball_font_size: 20,
  
  xp_text_font_size: 15,
  
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
  
  tier_up_show: false, // tier up overlay show
  
  enemy_texts: [ ],
}

ui.init = function(render) {
  let v = ui.vars,
      mouse = render.mouse,
      ctx = render.context
  ctx.lineCap = 'round'
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
  let v = ui.vars,
      render = Tower.render,
      ctx = render.context
  // tick time!
  v.time++
  // that's all?
}

ui.tickAfter = function() {
  let v = ui.vars,
      render = Tower.render,
      ctx = render.context
  // clear click
  v.click = false
  // how about hover?
}

ui.draw = function() {
  let v = ui.vars,
      render = Tower.render,
      mousepos = render.mouse.absolute,
      clickpos = v.click,
      ctx = render.context,
      player = Tower.player,
      playerX = player.x,
      playerY = player.y,
      playerSize = player.size,
      _width = render.options.width,
      _height = render.options.height,
      x, y,
      size,
      width, height
      // define common variables first
  
  // tick!
  ui.tick()
  
  // bar vars
  let xp_show = v.xp_bar_show,
      xp = math.lerp(v.xp_bar_xp, player.xp, 0.05), // CONST xp bar lerp
      // whether the UI is currently still smoothing
      smoothing = ( Math.abs(player.xp - v.xp_bar_xp) >= 0.01 ) // CONST xp bar smooth threshold
  if (xp_show > 0 || smoothing) {
    // more mars bars- no, bar vars
    let color = v.xp_bar_color,
        level = math.towerlevel(xp),
        current = xp - math.towerxp(level),
        next = math.towerxpneeded(level),
        ratio = current / next,
        rBall = 15 // CONST xp ball radius
    x = _width - v.xp_bar_side_x * xp_show
    height = v.xp_bar_length_ratio * _height
    let y1 = _height / 2 - height / 2 - rBall * 2,
        y2 = y1 + height,
        mid = y2 - ratio * height,
        yBall = y2 + rBall
    v.xp_bar_xp = xp
    // draw! (remember to add ctx)
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
  let health = Tower.health
  x = _width - v.health_heart_side_x
  y = _height - 20 - v.health_heart_side_y
  size = v.health_heart_size
  draw.setFill(ctx, "#cc0000")
  draw.setStroke(ctx, "transparent")
  draw._heart(ctx, x, y, size, size)
  draw.setFill(ctx, "#662c2c") // CONST health heart color
  draw.setFont(ctx, Math.floor(v.health_text_size) + "px Roboto")
  draw._text(ctx, x - 15 - size / 2, y + 3, health + "", 0, "right")
  
  // upgrade buttons
  
  // upgrade side
  
  // tier up button
  if (player.canTierUp && !v.tier_up_show) {
    size = 14 // CONST tier up button size
    x = playerX
    y = playerY - playerSize - size - 20 // CONST tier up button-body gap
    let color = "#00ffee", // CONST tier up button color
        mouseBoxSize = size * 1.1 // CONST tier up button mouse box ratio
    if ( Math.abs(mousepos.x - x) < mouseBoxSize && Math.abs(mousepos.y - y) < mouseBoxSize ) {
      size *= 1.0 // CONST tier up button hover size change
      color = "#ff7700" // CONST tier up button hover color (changed from #0095ff)
    }
    if ( Math.abs(clickpos.x - x) < mouseBoxSize && Math.abs(clickpos.y - y) < mouseBoxSize ) {
      v.tier_up_show = true
      controls.setPaused(true)
    }
    draw.setFillDarkenStroke(ctx, color)
    draw.setLineWidth(ctx, 3) // CONST tier up button border width
    draw._rectangle(ctx, x, y, size * 2, size * 2)
    // draw up symbol time
    let upSymbolSize = 0.7, // CONST
        arrowSize = 0.5 // CONST
    draw.setFill(ctx, "transparent")
    draw.setStroke(ctx, "#0c9400") // CONST tier up button symbol color
    draw.setLineWidth(ctx, 3) // CONST tier up button symbol line width
    draw._line(ctx, x, y - size * upSymbolSize, x - size * arrowSize, y - size * (upSymbolSize - arrowSize))
    draw._line(ctx, x, y - size * upSymbolSize, x + size * arrowSize, y - size * (upSymbolSize - arrowSize))
    draw._line(ctx, x, y - size * upSymbolSize, x, y + size * upSymbolSize)
  }
  
  // tier up overlay
  if (v.tier_up_show) {
    // draw translucent overlay rectangle
    draw.setFillNoStroke(ctx, "#00ffee") // CONST tier up overlay rect color
    ctx.save()
    draw.setGlobalAlpha(ctx, 0.6) // CONST tier up overlay rect opacity
    let overlayGap = 50
      draw._rect(ctx, overlayGap, overlayGap, _width - overlayGap * 2, _height - overlayGap * 2)
    ctx.restore()
    // draw X button
    x = _width - overlayGap * 2
    y = overlayGap * 2
    size = overlayGap / 5
    draw.setStrokeNoFill(ctx, "#cf0000") // CONST tier up overlay X button color
    draw.setLineWidth(ctx, 5)
      draw._line(ctx, x - size, y - size, x + size, y + size)
      draw._line(ctx, x + size, y - size, x - size, y + size)
    if ( // check whether the user presses the x button OR clicks the outside
         clickpos && (
         ( Math.abs(clickpos.x - x) < size * 2.5 && Math.abs(clickpos.y - y) < size * 2.5 ) ||
         ( clickpos.x < overlayGap || clickpos.y < overlayGap || clickpos.x > _width - overlayGap || clickpos.y > _height - overlayGap )
       ) ) {
      v.tier_up_show = false
      controls.setPaused(false)
    }
    // draw title
    let top_text_angle = math.degToRad(4)         // CONST tier up title text tilt angle
                           * Math.sin(v.time / 30) // CONST tier up title text tilt speed
    draw.setFill(ctx, "#003d09") // CONST tier up title text color
    draw.setStroke(ctx, "transparent")
    draw.setFont(ctx, "30px Roboto")
    // CONST tier up title text position (x, y)
      draw._text(ctx, _width / 2, _height / 4, "Choose an upgrade!", top_text_angle, "center")
    // some vars
    y = _height / 2 // CONST tier up circle y-position
    size = 50 // CONST tier up circle size
    let choices = ["T-5", "D-1"], // temporary FOR NOW todo
        choiceLength = choices.length,
        yText = y + size + 20 // CONST tier up circle text gap (y)
    // draw circles
    for (let i = 0; i < choiceLength; ++i) {
      const choice = choices[i],
            hovering = Vector.magnitudeSquared(Vector.sub(mousepos, Vector.create(x, y))) < size * size * 1.1 // CONST tier up circle mouse box size
      x = _width / 2 + (i - (choiceLength - 1) / 2) * (size * 2 + 25) // CONST tier up circles gap (x)
      if (hovering) {
        draw.setFill(ctx, "#7547ff55") // CONST tier up circle hover color
      } else {
        draw.setFill(ctx, "transparent")
      }
      draw.setStroke(ctx, "#3f00de") // CONST tier up circle border color
      draw.setLineWidth(ctx, 5) // CONST tier up circle line width
        draw._circle(ctx, x, y, size)
        draw.tower(render, x, y, size * 0.7, choice) // CONST tier up circle tower size ratio
      draw.setFill(ctx, "#283d00") // CONST tier up circle text
      draw.setStroke(ctx, "transparent")
      draw.setFont(ctx, "20px Roboto")
        draw._text(ctx, x, yText, choice, 0, "center")
    }
  }
  
  // enemy texts
  var i = 0
  for (let t of v.enemy_texts.slice()) {
    // lots of default values ahead!
    x = t.x
    y = t.y
    size = t.size
    draw.setFill(ctx, t.fill || t.color || "transparent")
    draw.setStroke(ctx, t.stroke || "transparent")
    draw.setLineWidth(ctx, t.lineWidth || 1)
    draw.setFont(ctx, Math.floor(size) + "px Roboto Condensed")
    ctx.save()
    draw.setGlobalAlpha(ctx, t.opacity || 1)
      draw._text(ctx, x, y, t.text, t.angle, "center")
    ctx.restore()
    if (t.time < v.time) {
      v.enemy_texts.splice(i, 1)
    }
    i++
  }
  
  // tick after...
  ui.tickAfter()
}
