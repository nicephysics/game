import { math } from "../util/math.js"

export var color = { }
export var theme = { }

theme.default = {
  black: "#000000",
  white: "#FFFFFF",
}

theme.set = function(type) {
  color = theme[type]
}

theme.set("default")
