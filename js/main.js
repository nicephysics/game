console.log("Hello World!")

var canvas = new fabric.Canvas("canvas")
console.log(canvas)

function resizeCanvas() {
  // resize to full window width and height
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function test_1() {
  // create a rectangle object
  var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
  })

  // "add" rectangle onto canvas
  canvas.add(rect)
}

document.addEventListener("DOMContentLoaded", function() {
  // moo
})

window.addEventListener("load", function() {
  resizeCanvas()
})
