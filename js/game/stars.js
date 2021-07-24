import { category, config } from "../config/config.js"

import { C, theme } from "../display/color.js"

import { random } from "../util/random.js"
import { math } from "../util/math.js"

export var stars = { }

// TOTAL REFERENCES: 8

// constants
stars.c = {
  star_size: 50,
  star_wobble: 10,
  planet_size: 2,
  orbit_size: 1000,
  real_planet_star_ratio: 109.19, // actual R_earth to R_sun ratio for reference
  real_star_orbit_ratio: 215.15, // actual R_sun to 1 AU ratio for reference
  // period is out of 360, e.g. 3600 period means in every 10 seconds the planet spins around once
  period_mult: 50,
}

stars.stars = {
  tutorial: {
    name: "Proxima Centauri",
    short: "α Cen C", // actually
    postfix: " ",
    secret: false,
    description: "Proxima Centauri is the nearest star to the Sun, four and a quarter light-years away.",
    game_description: "The tutorial star!",
    color: "#b03517",
    size: 0.1542,
    mass: 0.1221,
    constellation: "Centaurus",
    system_scale: 1,
    planets: [
      { name: "b",
        full: "α Cen Cb",
        wave: "tut1",
        description: "",
        game_description: "",
        color: "#bcffa3", // pale green... [6]
        size:   1.30, // large uncertainty here though
        mass:   1.60,
        radius: 0.04857,
        period: 11.18418,
        references: [
          "https://www.eso.org/public/archives/releases/sciencepapers/eso1629/eso1629a.pdf#page=2", // {3}
          "https://iopscience.iop.org/article/10.3847/1538-4357/aa6040/pdf#page=1", // {6} green
        ],
      },
      { name: "c",
        full: "α Cen Cc",
        wave: "tut2",
        description: "",
        game_description: "",
        color: "#5349ab",
        size:   1.913, // calculated from mass
        mass:   7,
        radius: 1.489,
        period: 1928,
        references: [
          "https://arxiv.org/pdf/2003.13106.pdf#page=3", // {4}
        ],
      },
      { name: "d",
        full: "α Cen Cd",
        wave: "tutsecret",
        description: "Discovered in 2020, this planet is unconfirmed.",
        game_description: "",
        color: "#916d6d",
        size:   0.662, // calculated from lower bound mass, can be more
        mass:   0.29, // lower bound mass
        radius: 0.02895,
        period: 5.168,
        references: [
          "https://arxiv.org/pdf/2005.12114.pdf#page=6", // {5}
        ],
      },
    ],
    references: [
      "https://en.wikipedia.org/wiki/Proxima_Centauri#Planetary_system", // {1} for planets
      "https://arxiv.org/pdf/1611.03495.pdf#page=3", // {2} for the star's mass and radius
    ],
  },
  test: {
    name: "Surreal Star",
    short: "★",
    postfix: " ",
    secret: false,
    description: "Testing stuff.",
    game_description: "Just a test...",
    color: "#ff00aa", // pink
    stroke: null,
    size: 1.00,
    mass: 1.00,
    constellation: "Dev",
    system_scale: 1,
    planets: [],
    references: [],
  },
  sun: {
    name: "The Sun",
    short: "☉",
    postfix: " ",
    secret: true,
    description: "The Sun is the Sun. The Sun. Sun. sun. un. n.",
    game_description: "A secret star... not really.",
    color: "#f8ff3d", // default yellow, slightly light
    size: 1.00,
    mass: 1.00,
    constellation: "Sol",
    system_scale: 1,
    planets: [],
    references: [ // haha
      "https://en.wikipedia.org/wiki/Sun", // {7}
      "https://en.wikipedia.org/wiki/Solar_System", // {8}
    ],
  },
}
