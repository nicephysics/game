import { math } from "../util/math.js"

export var C = { }
export var theme = { }

theme.default = {
  // grayscale colours
  black:         "#000000", // !
  white:         "#ffffff", // !
  grey:          "#6a6e7a", // !
  locked:        "#6a6e7a", // locked
  // red colours
  deepred:       "#d41111", // red text and heart and health colour
  orange:        "#d46a00", // xp bar base color
  // yellow colours
  // green colours
  // blue colours
  lightblue:     "#add1ff", // blue text probably
  darkblue:      "#00367d", // blue text probably
  cyan:          "#13f2d8", // tier up overlay / other overlay
  button:        "#00ffee", // button
  button_hover:  "#00ada2", // button hover
  // purple colours
  darkpurple:        "#27007a", // icons?
  // misc colours
  wow:           "#6EQUJ5", // Wow!
}

theme.set = function(type) {
  const t = theme[type]
  for (let k in t) {
    C[k] = t[k]
  }
}

// init (default)
theme.set("default")
