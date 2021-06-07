console.log("Hello World!")



var canvas

function getPixelRatio() {
  let dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1
  return dpr / bsr
}

function createCanvas() {
  let c = document.getElementById("canvas")
  c.width = window.innerWidth
  c.height = window.innerHeight
  c.style.width = window.innerWidth + "px"
  c.style.height = window.innerHeight + "px"
  canvas = new fabric.Canvas("canvas", {
    selecting: false,
  })
  fabric.Object.prototype.selectable = false
  console.log(canvas)
}

function test_1() {
  // create a rectangle object
  var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20,
    angle: 0,
  })

  // "add" rectangle onto canvas
  canvas.add(rect)
  
  console.log(rect)
  
  canvas.renderAll()
}

document.addEventListener("DOMContentLoaded", function() {
  // moo
})

window.addEventListener("load", function() {
  createCanvas()
  test_1()
})
