import { category, config } from "../config/config.js"

import { random } from "../util/random.js"
import { math } from "../util/math.js"

export var stars = { }

stars.stars = {
  tutorial: {
    name: "Proxima Centauri",
    short: "α Cen C", // actual
    planets: [
      { name: "b",
        full: "α Cen Cb",
        wave: "tut1",
        description: "",
        game_description: "",
      },
      { name: "c",
        full: "α Cen Cc",
        wave: "tut2",
        description: "",
        game_description: "",
      },
    ],
    description: "Proxima Centauri is the nearest star to the Sun, four and a quarter light-years away.",
    game_description: "",
  }
}
