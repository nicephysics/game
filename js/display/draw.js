// imports
import { style } from "./style.js"

import { Enemy } from "../game/enemy.js"
import { Tower } from "../game/tower.js"

if (true) {
  // 2 space indent!
}

export var draw = { }

const Vector = Matter.Vector

draw.ctx = document.getElementById("canvas").getContext("2d") // not actually needed?

draw.setFill = function(ctx, fill) {
  ctx = ctx || draw.ctx
  ctx.fillStyle = fill
}

draw.setStroke = function(ctx, stroke) {
  ctx = ctx || draw.ctx
  ctx.strokeStyle = stroke
}

draw.setStrokeNoFill = function(ctx, stroke) {
  draw.setStroke(ctx, stroke)
  draw.setFill(ctx, "transparent")
}

draw.setLightFill = function(ctx, fill) {
  draw.setFill(ctx, chroma(fill).brighten().hex())  
}

draw.setDarkFill = function(ctx, fill) {
  draw.setFill(ctx, chroma(fill).darken().hex())  
}

draw.setLightStroke = function(ctx, stroke) {
  draw.setStroke(ctx, chroma(stroke).brighten().hex())  
}

draw.setDarkStroke = function(ctx, stroke) {
  draw.setStroke(ctx, chroma(stroke).darken().hex())  
}

draw.setFillAndStroke = function(ctx, both) {
  draw.setFill(ctx, both)
  draw.setStroke(ctx, both)
}

draw.setFillDarkenStroke = function(ctx, both) {
  draw.setFill(ctx, both)
  draw.setStroke(ctx, chroma(both).darken().hex())
}

draw.setFillNoStroke = function(ctx, fill) {
  draw.setFill(ctx, fill)
  draw.setStroke(ctx, "transparent")
}

draw.setLineWidth = function(ctx, lineWidth) {
  ctx = ctx || draw.ctx
  ctx.lineWidth = lineWidth
}

draw.setGlobalAlpha = function(ctx, opacity) {
  ctx = ctx || draw.ctx
  ctx.globalAlpha = opacity
}

draw.setFont = function(ctx, fontString) {
  ctx = ctx || draw.ctx
  ctx.font = fontString
}

draw.textAlign = function(ctx, alignment) {
  ctx = ctx || draw.ctx
  switch (alignment) {
    case "":
      break
    case "left":
    case "leftmiddle":
      ctx.textBaseline = "middle"
      ctx.textAlign = "left"
      break
    case "top":
      ctx.textBaseline = "top"
      ctx.textAlign = "center"
      break
    case "normal":
    case "lefttop":
      ctx.textBaseline = "top"
      ctx.textAlign = "left"
      break
    case "leftbottom":
      ctx.textBaseline = "bottom"
      ctx.textAlign = "left"
      break
    case "center":
    case "centre":
    case "middle":
      ctx.textBaseline = "middle"
      ctx.textAlign = "center"
      break
    case "right":
    case "middleright":
      ctx.textBaseline = "middle"
      ctx.textAlign = "right"
      break
    case "righttop":
      ctx.textBaseline = "top"
      ctx.textAlign = "right"  
      break
    case "rightbottom":
      ctx.textBaseline = "bottom"
      ctx.textAlign = "right"  
      break
    case "bottom":
      ctx.textBaseline = "bottom"
      ctx.textAlign = "center"
      break
    default:
      console.error("Invalid alignment in draw.alignText: " + alignment)
  }
}

draw._rect = function(ctx, x, y, w, h) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.rect(x, y, w, h)
  ctx.stroke()
  ctx.fill()
}

draw.rect = function(render, x, y, w, h) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  draw._rect(ctx, x, y, w, h)
}

draw._rectangle = function(ctx, x, y, w, h, a = 0) {
  ctx = ctx || draw.ctx
  if (a !== 0) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(a)
      ctx.beginPath()
        ctx.rect(x - w / 2, y - h / 2, w, h)
      ctx.stroke()
      ctx.fill()
    ctx.restore()
  } else {
    ctx.beginPath()
      ctx.rect(x - w / 2, y - h / 2, w, h)
    ctx.stroke()
    ctx.fill()
  }
}

draw.rectangle = function(render, x, y, w, h, a = 0) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  draw._rectangle(ctx, x, y, w, h, a)
}

draw._circle = function(ctx, x, y, r) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
}

draw.circle = function(render, x, y, r) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  draw._circle(ctx, x, y, r)
}

draw._arc = function(ctx, x, y, r, start, end, counter = false) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.arc(x, y, r, start, end, counter)
  ctx.stroke()
  ctx.fill()
}

draw.arc = function(render, x, y, r, start, end, counter = false) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  draw._arc(ctx, x, y, r, start, end, counter)
}

draw._line = function(ctx, x1, y1, x2, y2) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
  ctx.stroke()
}

draw.line = function(render, x1, y1, x2, y2) {
  x1 -= render.bounds.min.x
  y1 -= render.bounds.min.y
  x2 -= render.bounds.min.x
  y2 -= render.bounds.min.y
  const ctx = render.context
  draw._line(ctx, x1, y1, x2, y2)
}

draw._polyline = function(ctx, x, y) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.moveTo(x[0], y[0])
    const len = Math.min(x.length, y.length)
    for (let i = 1; i < len; ++i) {
      ctx.lineTo(x[i], y[i])
    }
  ctx.stroke()
}

draw.polyline = function(render, xx, yy) {
  const new_x = [ ],
        new_y = [ ]
  for (let x of xx) {
    new_x.push(x - render.bounds.min.x)
  }
  for (let y of yy) {
    new_y.push(y - render.bounds.min.y)
  }
  const ctx = render.context
  draw._polyline(ctx, new_x, new_y)
}

draw._polygon = function(ctx, vs) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.moveTo(vs[0].x, vs[0].y)
    const len = Math.min(vs.length, vs.length)
    for (let i = 1; i < len; ++i) {
      ctx.lineTo(vs[i].x, vs[i].y)
    }
    ctx.lineTo(vs[0].x, vs[0].y)
  ctx.stroke()
}

draw.polygon = function(render, vs) {
  const new_v = [ ]
  for (let v of vs) {
    new_v.push(Vector.create(v.x - render.bounds.min.x, v.y - render.bounds.min.y))
  }
  const ctx = render.context
  draw._polygon(ctx, new_v)
}

draw._text = function(ctx, x, y, text, angle = 0, textAlign = "") {
  ctx = ctx || draw.ctx
  draw.textAlign(ctx, textAlign)
  if (angle !== 0) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.strokeText(text, 0, 0)
    ctx.fillText(text, 0, 0)
    ctx.restore()
  } else {
    // draw text!
    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)
  }
}

draw.text = function(render, x, y, text, angle = 0, textAlign = "") {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  draw._text(ctx, x, y, text, angle, textAlign)
}

draw.gun = function(render, x, y, length, height, aspect, angle) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  let h = []
  h = (aspect > 0) ?
    [ height * aspect, height ] :
    [ height, -height * aspect ]
  let r = [
    Math.atan2(h[0], length), 
    Math.atan2(h[1], length)
  ]
  let l = [
    Math.sqrt(length * length + h[0] * h[0]), 
    Math.sqrt(length * length + h[1] * h[1])
  ]

  ctx.beginPath()
    ctx.lineTo(x + l[0] * Math.cos(angle + r[0]),           y + l[0] * Math.sin(angle + r[0]))
    ctx.lineTo(x + l[1] * Math.cos(angle + Math.PI - r[1]), y + l[1] * Math.sin(angle + Math.PI - r[1]))
    ctx.lineTo(x + l[1] * Math.cos(angle + Math.PI + r[1]), y + l[1] * Math.sin(angle + Math.PI + r[1]))
    ctx.lineTo(x + l[0] * Math.cos(angle - r[0]),           y + l[0] * Math.sin(angle - r[0]))
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
}

draw.tower = function(render, x, y, size, type) {
  Tower.drawTower(render, x, y, size, type)
}

// credits to https://stackoverflow.com/questions/58333678/draw-heart-using-javascript-in-any-postionx-y
draw._heart = function(ctx, x, y, width, height) {
  // hmmm...
  y -= height / 2
  x -= width / 2
  
  ctx = ctx || draw.ctx
  ctx.save()
  ctx.beginPath()
  const topCurveHeight = height * 0.3
  ctx.moveTo(x, y + topCurveHeight)
  // top left curve
  ctx.bezierCurveTo(
    x, y, 
    x - width / 2, y, 
    x - width / 2, y + topCurveHeight
  )
  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2, y + (height + topCurveHeight) / 2, 
    x, y + (height + topCurveHeight) / 2, 
    x, y + height
  )
  // bottom right curve
  ctx.bezierCurveTo(
    x, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + topCurveHeight
  )
  // top right curve
  ctx.bezierCurveTo(
    x + width / 2, y, 
    x, y, 
    x, y + topCurveHeight
  )
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
  ctx.restore()
}

draw.heart = function(render, x, y, w, h) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  const ctx = render.context
  draw._heart(ctx, x, y, w, h)  
}

// math
// from https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
draw._splitText = function(ctx, text, maxWidth) {
  let words = text.split(" "),
      lines = [],
      currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    let word = words[i],
        width = ctx.measureText(currentLine + " " + word).width
    if (width < maxWidth) {
        currentLine += " " + word
    } else {
        lines.push(currentLine)
        currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

draw.splitText = function(ctx, text, maxWidth) {
  let lines = text.split("\n"),
      newlines = []
  for (let line of lines) {
    newlines = newlines.concat(draw._splitText(ctx, line, maxWidth))
  }
  return newlines
}
