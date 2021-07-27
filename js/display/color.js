import { math } from "../util/math.js"

export var C = { }
export var theme = { }

theme.default = {
  // grayscale colours
  black:         "#000000", // !
  white:         "#ffffff", // !
  almostwhite:   "#e8e8e8", // !
  lightgrey:     "#a4a9ba", // planet popup
  grey:          "#6e6e6e", // planet orbit default color
  darkgrey:      "#3c403d", // planet sidebar
  verydarkgrey:  "#212121", // !
  locked:        "#6a6e7a", // locked
  // red colours
  lightred:      "#e35656", // light red, used for text
  brightred:     "#ff1919", // very normal red (quite bright)
  darkred:       "#8f0303", // dark red, used for text
  deepred:       "#d41111", // red text and heart and health colour, like C.brightred
  // orange colours
  lightorange:   "#e8a87b", // light orange, for light text
  orange:        "#d46a00", // xp bar base color
  darkorange:    "#8f5317", // dark orange, actually brown sandy soil
  // yellow colours
  // green colours
  lightgreen:    "#54ff6e", // light green, used for text
  green:         "#25e829", // very normal green
  darkgreen:     "#114712", // dark forest green, used for text
  // blue colours
  lightblue:     "#add1ff", // blue text probably
  blue:          "#104ade", // very normal blue
  darkblue:      "#0a3773", // blue text probably
  deepblue:      "#061a69", // blue text probably
  cyan:          "#13f2d8", // tier up overlay / other overlay
  button:        "#00ffee", // button
  button_hover:  "#00ada2", // button hover
  // purple colours
  darkpurple:    "#27007a", // icons?
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
