import { draw } from "./draw.js"
import { style } from "./style.js"

import { controls } from "../game/controls.js"
import { Enemy } from "../game/enemy.js"
import { Tower } from "../game/tower.js"
import { towerstats, towermap } from "../game/towerstat.js"
import { wave } from "../game/wave.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

import { config, category } from "../config/config.js"

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
  
  upgrade_show: false, // upgrade overlay show
  tier_up_show: false, // tier up overlay show
  something_show: function() {
    const v = ui.vars
    return v.upgrade_show || v.tier_up_show
  },
  
  enemy_texts: [ ],
}

ui.closeOverlay = function() {
  const v = ui.vars
  v.upgrade_show = false
  v.tier_up_show = false
  controls.setPaused(false)
}

ui.hitrect = function(pos, x, y, w, h) {
  return pos && ( pos.x >= x && pos.y >= y && pos.x <= x + w && pos.y <= y + h )
}

ui.hitrectpoints = function(pos, x1, y1, x2, y2) {
  return pos && ( pos.x >= x1 && pos.y >= y1 && pos.x <= x2 && pos.y <= y2 )
}

ui.hitcircle = function(pos, x, y, size) {
  return pos && Vector.magnitudeSquared(Vector.sub(pos, Vector.create(x, y))) < size * size
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
  
  // define common variables first
  
  const v = ui.vars,
        render = Tower.render,
        ctx = render.context,
        player = Tower.player,
        playerX = player.x,
        playerY = player.y,
        playerSize = player.size,
        playerType = player.type,
        playerStat = player.stat,
        _width = render.options.width,
        _height = render.options.height
  
  let mousepos = render.mouse.absolute,
      clickpos = v.click,
      stat = towerstats[playerType],
      x = 0,
      y = 0,
      size = 0,
      width = 0,
      height = 0
  
  
  // tick!
  ui.tick()
  
  // there will be 5 spaces after every major section in this function
  
  
  
  
  
  // draw the xp bar
  
  if (true) {
    // bar vars
    let xp_show = v.xp_bar_show,
        xp = math.lerp(v.xp_bar_xp, player.xp, 0.05), // CONST xp bar lerp
        // whether the UI is currently still smoothing
        smoothing = ( Math.abs(player.xp - v.xp_bar_xp) >= 0.01 ) // CONST xp bar smooth threshold
    if (xp_show > 0 || smoothing) {
      // more mars bars- no, bar vars
      let color = v.xp_bar_color,
          level = math.towerlevel(Math.round(xp)),
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
      if (smoothing || ( mousepos && mousepos.x > (_width - v.xp_bar_side_x_mouse * xp_show) && mousepos.y > y1 - 10 && mousepos.y < y2 )) {
        draw.setFont(ctx, Math.floor(v.xp_text_font_size) + "px Roboto Condensed")
        draw.setDarkFill(ctx, color)
        draw._text(ctx, x - 15, mid, math.number(current) + "/" + math.number(next), 0, "right")
      }
      if (mousepos && mousepos.x > (_width - v.xp_bar_side_x_mouse * xp_show) && mousepos.y > yBall - rBall && mousepos.y < yBall + rBall) {
        draw.setFont(ctx, Math.floor(v.xp_text_font_size) + "px Roboto Condensed")
        draw.setDarkFill(ctx, color)
        draw._text(ctx, x - rBall - 15, yBall, "Level " + Math.round(level), 0, "right")
      }
    }
  }
  
  
  
  
  
  // draw planet health
  
  if (true) {
    const towerHealth = Tower.health
    x = _width - v.health_heart_side_x
    y = _height - 20 - v.health_heart_side_y
    size = v.health_heart_size
    draw.setFill(ctx, "#cc0000")
    draw.setStroke(ctx, "transparent")
    draw._heart(ctx, x, y, size, size)
    draw.setFill(ctx, "#662c2c") // CONST health heart color
    draw.setFont(ctx, Math.floor(v.health_text_size) + "px Roboto")
    draw._text(ctx, x - 15 - size / 2, y + 3, towerHealth + "", 0, "right")
  }
  
  // draw upgrade buttons
  
  
  
  // draw upgrade overlay
  
  if (v.upgrade_show) {
    // draw translucent overlay rectangle
    draw.setFillNoStroke(ctx, "#ffa200") // CONST upgrade overlay rect color
    ctx.save() // save the canvas
    draw.setGlobalAlpha(ctx, 0.65) // CONST upgrade overlay rect opacity
    const overlayGap = 40 // CONST upgrade overlay gap
      draw._rect(ctx, overlayGap, overlayGap, _width - overlayGap * 2, _height - overlayGap * 2)
    ctx.restore() // restore the canvas to last save (above)
    // draw X button
    if (true) {
      const crossX = _width - overlayGap * 2.4,
            crossY = overlayGap * 2.4
      size = 10 // CONST upgrade overlay X button size
      draw.setStrokeNoFill(ctx, "#cf0000") // CONST upgrade overlay X button color
      draw.setLineWidth(ctx, 5)
        draw._line(ctx, crossX - size, crossY - size, crossX + size, crossY + size)
        draw._line(ctx, crossX + size, crossY - size, crossX - size, crossY + size)
      if ( // check whether the user presses the x button OR clicks the outside (hee)
           clickpos && (
           ( Math.abs(clickpos.x - crossX) < size * 2.5 && Math.abs(clickpos.y - crossY) < size * 2.5 ) ||
           ( clickpos.x < overlayGap || clickpos.y < overlayGap || clickpos.x > _width - overlayGap || clickpos.y > _height - overlayGap )
         ) ) {
        ui.closeOverlay()
        clickpos = false
      }
    }
    // draw title
    const top_text_angle = math.degToRad(1)           // CONST upgrade overlay title text tilt angle
                             * Math.sin(v.time / 100) // CONST upgrade overlay title text tilt speed
    draw.setFill(ctx, "#3d2200") // CONST upgrade overlay title text color
    draw.setStroke(ctx, "transparent")
    draw.setFont(ctx, "30px Roboto")
    // CONST tier up title text position (x, y)
      draw._text(ctx, _width / 2, _height / 4, "Upgrade Stats", top_text_angle, "center")
    // finally!
    // upgrade constant vars (mostly arrays)
    const upgradeList = config.upgradetext[playerStat.upgradetext],
          upgradeNumbers = playerStat.upgradeArray,
          upgradeColors = style.upgradetext,
          upgradeLength = upgradeList.length,
          upgradeMax = 1 + upgradeNumbers.reduce((a, b) => Math.max(a, b))
    // vars that (can) change each loop (rather, *let*s that change every loop)
    let utext = "default stat name",
        unumber = 0,
        ucolor = "#888888",
        ratio = 0,
        percentText = "0%",
        ygap = 6, // gap between rows
        hovering = false,
        clicking = false,
        hovering_ = false,
        clicking_ = false,
        clicked = -1,
        clicksign = 0,
    
    x = _width / 3 - 10
    width = _width / 3 - 50
    height = 20 // height of each one
    ygap += height
    y = _height / 2 - (upgradeLength - 1) / 2
    // a HUGE loop
    for (let i = 0; i < upgradeLength; ++i) {
      if (upgradeList[i] === "") {
        continue
      }
      utext = upgradeList[i]
      ucolor = upgradeColors[i]
      unumber = upgradeNumbers[i] + 1
      ratio = unumber / upgradeMax
      size = 10
      const percentText = Math.round(ratio * 100) + "%"
      // draw upgrade bar title
      draw.setDarkFill(ctx, ucolor)
      draw.setStroke(ctx, "transparent")
      draw.setFont(ctx, "16px Roboto Condensed") // CONST upgrade bar text font
        draw._text(ctx, x - 20, y, utext, 0, "right")
      // upgrade bar button hover/click detection
      hovering = ui.hitcircle(mousepos, x, y, size + 2)
      hovering_ = ui.hitcircle(mousepos, x + 60, y, size + 3)
      clicking = ui.hitcircle(clickpos, x, y, size + 2)
      clicking_ = ui.hitcircle(clickpos, x + 60, y, size + 3)
      if (clicking) {
        clicked = i
        clicksign = 1
      } else if (clicking_) {
        clicked = i
        clicksign = -1
      }
      // draw upgrade plus/minus button circles
      draw.setLineWidth(ctx, 3)
      draw.setFillDarkenStroke(ctx, (hovering) ? "#46bf00" : ucolor)
        draw._circle(ctx, x, y, size)
      draw.setFillDarkenStroke(ctx, (hovering_) ? "#bf3600" : ucolor)
        draw._circle(ctx, x + 60, y, size)
      draw.setDarkFill(ctx, ucolor)
      draw.setStroke(ctx, "transparent")
        draw._text(ctx, x + 30, y, unumber + "", 0, "center")
      // draw upgrade plus/minus signs
      size *= 0.6 // CONST upgrade bar plus/minus sign size ratio
      draw.setStrokeNoFill(ctx, "#006b07") // CONST upgrade bar plus color
        draw._line(ctx, x - size, y, x + size, y)
        draw._line(ctx, x, y - size, x, y + size)
      draw.setStrokeNoFill(ctx, "#6b0000") // CONST upgrade bar minus color
        draw._line(ctx, x + 60 - size, y, x + 60 + size, y)
      // draw bar
      x += 85 // CONST upgrade bar x-translate of bar
      draw.setFill(ctx, "transparent")
      draw.setDarkStroke(ctx, ucolor)
      draw.setLineWidth(ctx, 10) // CONST upgrade bar thicker line width
        draw._line(ctx, x, y, x + width, y)
      draw.setLightStroke(ctx, ucolor)
      draw.setLineWidth(ctx, 8) // CONST upgrade bar thinner line width
        draw._line(ctx, x, y, x + width, y)
      draw.setStroke(ctx, ucolor)
        draw._line(ctx, x, y, x + width * ratio, y)
      // draw % text
      draw.setDarkFill(ctx, ucolor)
      draw.setStroke(ctx, "transparent")
        draw._text(ctx, x + width + 15, y, percentText, 0, "left")
      x -= 85 // same as above
      y += ygap
    }
    
    if (clicked !== -1 && clicksign !== 0) {
      const index = clicked,
            key = playerStat.upgradekeys[index],
            maxstat = playerStat.upgradeMax[key],
            newstat = playerStat.upgrade[key] + clicksign
      if ( (newstat <= maxstat || maxstat === -1) && newstat >= 0) {
        playerStat.upgrade[key] = newstat
      } else {
        // todo invalid
      }
    }
    
  }
  
  
  
  
  
  // tier up button
  
  if (player.canTierUp && !v.tier_up_show) {
    size = 14 // CONST tier up button size
    x = playerX
    y = playerY - playerSize - size - 20 // CONST tier up button-body gap
    let color = "#00ffee" // CONST tier up button color
    const mouseBoxSize = size * 1.1 // CONST tier up button mouse box ratio
    if ( mousepos && Math.abs(mousepos.x - x) < mouseBoxSize && Math.abs(mousepos.y - y) < mouseBoxSize ) {
      size *= 1.0 // CONST tier up button hover size change
      color = "#ff7700" // CONST tier up button hover color (changed from #0095ff)
    }
    if ( clickpos && Math.abs(clickpos.x - x) < mouseBoxSize && Math.abs(clickpos.y - y) < mouseBoxSize ) {
      v.tier_up_show = true
      controls.setPaused(true)
      clickpos = false
    }
    draw.setFillDarkenStroke(ctx, color)
    draw.setLineWidth(ctx, 3) // CONST tier up button border width
    draw._rectangle(ctx, x, y, size * 2, size * 2)
    // draw up symbol time
    const upSymbolSize = 0.7, // CONST
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
    const overlayGap = 50
      draw._rect(ctx, overlayGap, overlayGap, _width - overlayGap * 2, _height - overlayGap * 2)
    ctx.restore()
    // draw X button
    x = _width - overlayGap * 2
    y = overlayGap * 2
    size = 10 // CONST tier up overlay X button size
    draw.setStrokeNoFill(ctx, "#cf0000") // CONST tier up overlay X button color
    draw.setLineWidth(ctx, 5)
      draw._line(ctx, x - size, y - size, x + size, y + size)
      draw._line(ctx, x + size, y - size, x - size, y + size)
    if ( // check whether the user presses the x button OR clicks the outside
         clickpos && (
         ( Math.abs(clickpos.x - x) < size * 2.5 && Math.abs(clickpos.y - y) < size * 2.5 ) ||
         ( clickpos.x < overlayGap || clickpos.y < overlayGap || clickpos.x > _width - overlayGap || clickpos.y > _height - overlayGap )
       ) ) {
      ui.closeOverlay()
      clickpos = false
    }
    // draw title
    const top_text_angle = math.degToRad(4)         // CONST tier up title text tilt angle
                             * Math.sin(v.time / 30) // CONST tier up title text tilt speed
    draw.setFill(ctx, "#003d09") // CONST tier up title text color
    draw.setStroke(ctx, "transparent")
    draw.setFont(ctx, "30px Roboto Condensed")
    // CONST tier up title text position (x, y)
      draw._text(ctx, _width / 2, _height / 4, "Choose an upgrade!", top_text_angle, "center")
    // some vars
    y = _height / 2 // CONST tier up circle y-position
    size = 50 // CONST tier up circle size
    const choices = stat.displayUpgrades || ["G-0"], // ?
          choiceLength = choices.length,
          yText = y + size + 20 // CONST tier up circle text gap (y)
    let hovered = -1,
        clicked = -1
    // draw circles
    for (let i = 0; i < choiceLength; ++i) {
      x = _width / 2 + (i - (choiceLength - 1) / 2) * (size * 2 + 25) // CONST tier up circles gap (x)
      const choice = choices[i],
            mouseBoxSize = 1.05, // CONST tier up circle mouse box size
            hovering = ui.hitcircle(mousepos, x, y, size * mouseBoxSize),
            clicking = ui.hitcircle(clickpos, x, y, size * mouseBoxSize)
      if (clicking) {
        clicked = i
      }
      if (hovering) {
        hovered = i
        draw.setFill(ctx, "#7547ff55") // CONST tier up circle hover color
      } else {
        draw.setFill(ctx, "transparent")
      }
      draw.setStroke(ctx, "#3f00de") // CONST tier up circle border color
      draw.setLineWidth(ctx, 5) // CONST tier up circle line width
        draw._circle(ctx, x, y, size)
        draw.tower(render, x, y, size * 0.7, choice) // CONST tier up circle tower size ratio
      draw.setFill(ctx, "#4b00ad") // CONST tier up circle text
      draw.setStroke(ctx, "transparent")
      draw.setFont(ctx, "20px Roboto Mono")
        draw._text(ctx, x, yText, choice, 0, "center")
    }
    if (hovered >= 0) {
      const choice = choices[hovered],
            text = towerstats[towermap[choice]].description, // "Description for " + choice,
            fontSize = 20,
            fontGap = 24
      draw.setFillNoStroke(ctx, "#003d09") // CONST tier up description text
      draw.setFont(ctx, fontSize + "px Roboto Condensed")
      const lines = draw.splitText(ctx, text, _width - overlayGap * 6),
            y = 3 * _height / 4 - (lines.length - 1) / 2 * fontGap
      let i = 0
      for (let line of lines) {
        draw._text(ctx, _width / 2, y + fontGap * i, line, 0, "center")
        ++i
      }
    }
    if (clicked >= 0) {
      player.type = towermap[choices[clicked]]
      player.refresh()
      ui.closeOverlay()
      clickpos = false
    }
  }
  
  
  
  
  
  // enemy texts
  
  let i = 0
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
    ++i
  }
  
  
  
  
  
  // tick after...
  ui.tickAfter()
  
  // end of function
}
