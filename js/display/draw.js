// imports
import { style } from "./style.js"

export var draw = { }

draw.ctx = document.getElementById("canvas").getContext("2d") // not actually needed?

draw.setFill = function(ctx, fill) {
  ctx = ctx || draw.ctx
  ctx.fillStyle = fill
}

draw.setStroke = function(ctx, stroke) {
  ctx = ctx || draw.ctx
  ctx.strokeStyle = stroke
}

draw.setFillAndStroke = function(ctx, both) {
  draw.setFill(ctx, both)
  draw.setStroke(ctx, both)
}

draw.rect = function(ctx, x, y, w, h) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.rect(x, y, w, h)
  ctx.stroke()
  ctx.fill()
}

draw.rectangle = function(ctx, x, y, w, h) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.rect(x - w / 2, y - h / 2, w, h)
  ctx.stroke()
  ctx.fill()
}

draw.circle = function(ctx, x, y, r) {
  ctx = ctx || draw.ctx
  ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
}

draw.gun = function(render, x, y, length, height, aspect, angle) {
  x -= render.bounds.min.x
  y -= render.bounds.min.y
  var ctx = render.context
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
