import { category, config } from "../config/config.js"

import { Enemy } from "./enemy.js"
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
export var waves = { }

waves.current = 0
waves.waves = null

waves.init = function(name) {
  waves.current = 0
  waves.waves = waves[name]
  const W = waves.waves,
        currtext = W.starttext[0]
  if (currtext != null) {
    ui.vars.waves_popup_text.push(...currtext)    
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
}

const makelevel = function(levelname) {
  waves[levelname] = {
    wave: [],
    starttext: {},
    endtext: {},
  }
  return waves[levelname]
}


/* TUTORIAL */
if ("TUTORIALS") {
  const tut1_1 = makelevel("tut1_1")
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
    }, /*{ // 5
      type: "asteroid",
      rating: 3,
      number: 10,
      sep: 5,
      m: 0.1, s: 1, z: 10, g: 0.1,
    }, { // 6
      type: "ball",
      rating: 3,
      number: 10,
      sep: 5,
      m: 0.1, s: 1, z: 10, g: 0.1,
    }*/
  )
  tut1_1.starttext = {
    [0]: ["Welcome to the tutorial! You are a [thing] trying to protect the planet from incoming asteroids.",
          "Use ↑↓→← or wasd keys to move and click (and hold) to launch a projectile.",
          "The lighter area of the screen is the atmosphere of the planet. Everything inside the atmosphere falls due to gravity and everything above it floats in space!",
          "Ready? Press the play button at the top of the screen to begin!",
          ],
    [1]: ["The first asteroids should start to appear now.", ],
    [4]: ["Many asteroids can appear at the same time too!", ],
  }
  tut1_1.endtext = {
    [1]: ["Did you hit the 2 asteroids away? More of them will come this time...", ],
    [2]: ["The asteroids will start to come at a faster rate after this, try to keep up!", ],
    [3]: ["The points you gain from hitting asteroids can be used for upgrading!",
          "Press the statistics button in the bottom right (or press U) to enter the upgrade screen.",
          "In the upgrade screen, you can improve your [thing] by pressing the plus button on any one of the improvements!",
          ],
    [4]: ["Congratulations, you have completed the tutorial!",
          "There is another more advanced tutorial for you. Click on the next planet to continue!",
         ],
  }
  const tut1_2 = makelevel("tut1_2")
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
          "Did you know you could click and hold to constantly shoot?",
          "This tutorial is slightly harder... good luck!",
          ],
    [3]: ["10 asteroids incoming at once!", ],
  }
  tut1_2.endtext = {
    [4]: ["More waves coming soon..."],
  }
  const tut2_1 = makelevel("tut2_1")
  const tutsecret = makelevel("tutsecret")
}
