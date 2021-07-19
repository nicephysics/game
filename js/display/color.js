import { math } from "../util/math.js"

export var color = { }
export var theme = { }

theme.default = {
  black: "#000000",
  white: "#FFFFFF",
}

theme.set = function(type) {
  const t = theme[type]
  for (let k in t) {
    color[k] = t[k]
  }
}

theme.set("default")
