import { category, config } from "../config/config.js"

import { C, theme } from "../display/color.js"

import { random } from "../util/random.js"
import { math } from "../util/math.js"

export var stars = { }

// TOTAL REFERENCES: 8

// constants
stars.c = {
  // should be around 1
  star_size: 1,
  star_wobble: 1,
  planet_size: 1,
  orbit_size: 1,
  real_planet_star_ratio: 109.19, // actual R_earth to R_sun ratio for reference
  real_star_orbit_ratio: 215.15, // actual R_sun to 1 AU ratio for reference
  // period is out of 360, e.g. 3600 period means in every 10 seconds the planet spins around once
  period_mult: 100, // the higher the multiplier, the slower planets move
  // planet stuff
  planet_types: [ // unused
    // rock
    "Rock", "Carbon", "Desert", "Ice", "Iron", "Lava", "Volcanic", "Ocean", "Underground ocean",
    // gas
    "Gas dwarf", "Gas giant", "Helium", "Ice giant",
  ],
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
    size:   23.0,
    mass:   0.12,
    wobble: 0.05, // just a bit
    wobblePeriod: null,
    real_size: 0.1542,
    real_mass: 0.1221,
    constellation: "Centaurus",
    system_scale: 1.2,
    planets: [
      { name: "b",
        full: "α Cen Cb",
        waves: [
          { char: "1",
            description: "The first tutorial!",
            wave: "tut1_1",
            difficulty: 1,
            difficulty_rating: 0,
          },
          { char: "2",
            description: "The first tutorial - but harder!",
            wave: "tut1_2",
            difficulty: 3,
            difficulty_rating: 1,
          },
        ],
        description: "This pale green planet is the first planet to be explored. It has since been converted into a training site for new spherical flying objects.",
        real_description: "This is a pale green planet, the first one to be discovered orbiting Proxima Centauri, the nearest star to the Earth.",
        color: "#bcffa3", // same as real color
        size:   5.80, // 15
        mass:   1.60,
        radius: 148.0,
        period: 11.18418,
        real_color: "#bcffa3", // pale green... [6]
        real_size:   1.30, // large uncertainty here though
        real_mass:   1.60,
        real_radius: 0.04857,
        real_period: 11.18418,
        references: [
          "https://www.eso.org/public/archives/releases/sciencepapers/eso1629/eso1629a.pdf#page=2", // {3}
          "https://iopscience.iop.org/article/10.3847/1538-4357/aa6040/pdf#page=1", // {6} green
        ],
      },
      { name: "c",
        full: "α Cen Cc",
        waves: [
          { char: "1",
            wave: "tut2_1",
            description: "The second tutorial!",
            difficulty: 2,
            difficulty_rating: 0,
          },
        ],
        description: "This planet is the larger and more advanced training center for slightly more experienced spherical flying objects.",
        real_description: "A larger planet with a longer orbital period, this planet might have some rings.",
        color: "#5349ab",
        size:   16.5,
        mass:   10,
        radius: 650.0,
        period: 128.0,
        real_size:   1.913, // calculated from mass
        real_mass:   7,
        real_radius: 1.489,
        real_period: 1928,
        references: [
          "https://arxiv.org/pdf/2003.13106.pdf#page=3", // {4}
        ],
      },
      { name: "d",
        full: "α Cen Cd",
        waves: [
          { char: "S",
            wave: "tutsecret",
            description: "A secret tutorial???",
            difficulty: 5,
            difficulty_rating: 1,
          },
        ],
        description: "The first secret planet! It is small and hard to spot unless you look closely...",
        real_description: "Discovered in 2020 using the radial velocity method, this small, fast planet is still unconfirmed.",
        color: "#916d6d",
        size:   3.75,
        mass:   0.29,
        radius: 50.0,
        period: 5.168,
        real_size:   0.662, // calculated from lower bound mass, can be more
        real_mass:   0.29, // lower bound mass
        real_radius: 0.02895,
        real_period: 5.168,
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
    size: 100.00,
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
    size: 100.00,
    mass: 1.00,
    real_size: 1.00,
    real_mass: 1.00,
    constellation: "Sol",
    system_scale: 1,
    planets: [],
    references: [ // haha
      "https://en.wikipedia.org/wiki/Sun", // {7}
      "https://en.wikipedia.org/wiki/Solar_System", // {8}
    ],
  },
}
