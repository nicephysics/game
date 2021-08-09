import { category, config } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { save } from "./save.js"
import { Tower } from "./tower.js"
import { wave } from "./wave.js"

// display stuff here?
import { ui } from "../display/ui.js"

import { random } from "../util/random.js"
import { math } from "../util/math.js"

if (true) {
  // 2 space indent!
}

const Vector = Matter.Vector

// to fill up later
export const waves = { }

waves.current = 0
waves.levelname = ""
waves.waves = null

waves.init = function(name, continued = false) {
  waves.levelname = name
  waves.waves = waves[name]
  const W = waves.waves
  ui.vars.waves_finish = false
  if (continued) {
    // save the game?
  } else {
    waves.current = 0
    const currtext = W.starttext[0]
    if (currtext != null) {
      ui.vars.waves_popup_text.push(...currtext)    
    }
  }
}

waves.start = function() {
  const W = waves.waves
  if (W && !Enemy.waveOn()) {
    ++waves.current
    const curr = waves.current,
          currwave = W.wave[curr - 1],
          currtext = W.starttext[curr]
    if (currwave == null) {
      ui.vars.waves_all_clear = true
    } else {
      Enemy.sendwave(currwave)
    }
    if (currtext != null) {
      ui.vars.waves_popup_text.push(...currtext)
    }
  }
}

waves.end = function() {
  if (waves.waves == null) return
  const W = waves.waves,
        curr = waves.current,
        currtext = W.endtext[curr]
  if (currtext != null) {
    ui.vars.waves_popup_text.push(...currtext)
  }
  save.savewave() // save the game!
  // finish the game!
  if (curr >= W.number) {
    waves.finish()
  }
}

waves.finish = function() {
  ui.vars.waves_finish = true
}

const makelevel = function(levelname) {
  waves[levelname] = {
    wave: [],
    number: 0,
    starttext: {},
    endtext: {},
  }
  return waves[levelname]
}


/* TUTORIAL */
if ("TUTORIALS") {
  const tut1_1 = makelevel("tut1_1")
  tut1_1.number = 5
  tut1_1.wave.push(
    { // 1
      type: "asteroid",
      rating: 1,
      number: 2,
      sep: 7,
      m: 0.1, s: 0.5, g: 0.2, // MSG!
    }, { // 2
      type: "asteroid",
      rating: 1,
      number: 5,
      sep: 5,
      m: 0.1, s: 0.5, g: 0.2,
    }, { // 3
      type: "asteroid",
      rating: 1,
      number: 6,
      sep: 3,
      m: 0.1, s: 0.5, g: 0.2,
    }, { // 4
      type: "asteroid",
      rating: 1,
      number: 4,
      sep: 0.1,
      m: 0.1, s: 0.5, g: 0.2,
    }, { // 5
      type: "asteroid",
      rating: 2,
      number: 10,
      sep: 2,
      m: 0.2, s: 0.75, g: 0.25,
    }, /*{ // 6
      type: "asteroid",
      rating: 3,
      number: 10,
      sep: 5,
      m: 0.1, s: 1, z: 10, g: 0.1,
    }, { // 7
      type: "ball",
      rating: 3,
      number: 10,
      sep: 5,
      m: 0.1, s: 1, z: 10, g: 0.1,
    }*/
  )
  tut1_1.starttext = {
    [0]: ["Welcome to the tutorial! You are a SFO trying to protect the planet from incoming asteroids. ☄️",
          "Use ↑↓→← or wasd keys to move. Click (and hold) to launch a projectile!",
          "The lighter area of the screen is the atmosphere of the planet. Everything inside the atmosphere falls due to gravity and everything above it floats in space!",
          "Furthermore, you cannot go past the atmosphere barrier or into the ground.",
          "Ready? Press the green play button at the top of the screen to begin! (it will appear after you press OK→)",
          ],
    [1]: ["The first asteroids should start to appear now. Press the green play button again!", ],
    [4]: ["Many asteroids can appear at the same time, get ready!", ],
    [5]: ["This is the final round... beware.", ],
  }
  tut1_1.endtext = {
    [1]: ["Did you hit the 2 asteroids away? More of them will come this time...", ],
    [2]: ["The asteroids will start to come at a faster rate after this, try to keep up!", ],
    [3]: ["The points you gain from hitting asteroids can be used for upgrading!",
          "Press the statistics button in the bottom right (or press U) to enter the upgrade screen.",
          "In the upgrade screen, you can improve your [thing] by pressing the plus button on any one of the improvements!",
          ],
    [4]: ["If an asteroid reaches the ground, you lose ❤️ health.",
          "Your health is shown at the bottom right corner. If it reaches zero (or negative), you lose!", ],
    [5]: ["Congratulations, you have successfully completed this tutorial!",
          "There is another more advanced tutorial for you. Click on the next planet to continue!",
         ],
  }
  const tut1_2 = makelevel("tut1_2")
  tut1_1.number = 4 // for now
  tut1_2.wave.push(
    { // 1
      type: "asteroid",
      rating: 1,
      number: 5,
      sep: 3,
      m: 0.5, s: 0.5, g: 0.2,
    }, { // 2
      type: "asteroid",
      rating: 1,
      number: 10,
      sep: 1.5,
      m: 0.4, s: 0.3, g: 0.2,
    }, { // 3
      type: "asteroid",
      rating: 1,
      number: 10,
      sep: 0.1,
      m: 0.4, s: 0.35, g: 0.2,
    }, { // 4
      type: "asteroid",
      rating: 1,
      number: 2,
      sep: 6,
      m: 2, s: 0.75, g: 0.15,
    },
  )
  tut1_2.starttext = {
    [0]: ["Welcome to tutorial 1.2!",
          "Remember: you could click and hold to constantly shoot? You could also press E to automatically shoot all the time!",
          "Note: This tutorial is slightly harder... good luck!",
          ],
    [3]: ["10 asteroids incoming at once!", ],
  }
  tut1_2.endtext = {
    [4]: ["More waves coming soon..."],
  }
  const tut2_1 = makelevel("tut2_1")
  const tutsecret = makelevel("tutsecret")
}
