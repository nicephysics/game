
export var gunset = {
  // overall gun scale
  scale: 0.1,
}

gunset.some_random_comments = {
  x: 0, // position.x (*)
  y: 0, // position.y (*)
  w: 0, // size.x (*)
  h: 10, // size.y (*)
  a: 0, // angle (default: 0)
  d: 0, // shooting delay (default: 0)
  style: "#a7a7af", // fill style (default: "#a7a7af")
  stroke: null, // stroke style (default: same as fill style)
  lineWidth: 3, // stroke line width (default: 3)
  shape: "rectangle", // shape (default: rectangle)
  dummy: false, // dummy gun (default: false)
  aspects: { } // shape aspects (default: nothing)
}

gunset.default = {
  x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
  shape: "rectangle",
}
