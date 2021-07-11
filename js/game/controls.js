import { config, category } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"
import { Thing } from "./thing.js"
import { things } from "./things.js"
import { waves } from "./waves.js"

import { math } from "../util/math.js"
import { random } from "../util/random.js"

import { ui } from "../display/ui.js"

if (true) {
  // 2 space indent!
}

export var controls = { }

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Vector = Matter.Vector

let ON_N = false,
    ON_M = false

controls.setPaused = function(paused) {
  const player = Tower.player
  if (player != null) {
    player.control.paused = paused
  }
  Thing.runner.enabled = !paused
}

controls.isPaused = function() {
  const player = Tower.player
  return player && player.control.paused
}

controls.toggleN = function() {
  ON_N = !ON_N
}

controls.toggleM = function() {
  ON_M = !ON_M
}

controls.levelup = function(level) {
  const player = Tower.player
  // to level up one level
  // player.addxp(50 * (player.level + 1))
  // to level up to a certain level
  if (player != null) {
    player.addxp(math.towerxp(level) - player.xp)
  }
}

const playerExists = function() {
  return Tower.player != null
}

controls.init = function(render) {
  const engine = render.engine,
        mouse = render.mouse,
        world = engine.world,
        player = Tower.player,
        body = player.body
  
  player.control = {
    up: false,
    down: false,
    left: false,
    right: false,
    pointer: Vector.create(0, 0), // to avoid the classic NaN
    paused: false,
    shoot: false,
    altshoot: false,
    midshoot: false,
    autoshoot: false,
    autorotate: false,
  }
  
  var c = player.control // alias
  
  document.addEventListener("keydown", function(event) {
    if (!playerExists()) {
      return
    }
    switch (event.code) {
      case "KeyS":
      case "ArrowDown":
        c.down = true
        break
      case "KeyW":
      case "ArrowUp":
        c.up = true
        break
      case "KeyA":
      case "ArrowLeft":
        c.left = true
        break
      case "KeyD":
      case "ArrowRight":
        c.right = true
        break
    }
  })
  
  document.addEventListener("keyup", function(event) {
    if (!playerExists()) {
      return
    }
    switch (event.code) {
      case "KeyS":
      case "ArrowDown":
        c.down = false
        break
      case "KeyW":
      case "ArrowUp":
        c.up = false
        break
      case "KeyA":
      case "ArrowLeft":
        c.left = false
        break
      case "KeyD":
      case "ArrowRight":
        c.right = false
        break
      case "KeyE":
        c.autoshoot = !c.autoshoot
        break
      case "KeyR":
        c.autorotate = !c.autorotate
        break
      case "KeyQ":
        if (Enemy.waveOn()) {
          ui.vars.target_wave_show = 1 - ui.vars.target_wave_show
        } else {
          waves.start()
        }
        break
      case "KeyP":
        if (!ui.vars.something_show()) {
          controls.setPaused(!c.paused)
        }
        break
      case "KeyY":
        if (player.canTierUp && ui.vars.waves_popup_text.length == 0) {
          function showOverlay() {
            if (ui.vars.waves_popup_text.length == 0) {
              ui.vars.tier_up_show = true
              controls.setPaused(true)
            }
          }
          if (ui.vars.something_show()) {
            if (!ui.vars.tier_up_show) {
              ui.closeOverlay()
              showOverlay()
            } else {
              ui.closeOverlay()
            }
          } else {
            if (!ui.vars.tier_up_show) {
              showOverlay()
            } else {
              ui.closeOverlay()
            }
          }
        }
        break
      case "KeyU":
        if (ui.vars.waves_popup_text.length == 0) {
          function showOverlay() {
            ui.vars.upgrade_show = true
            controls.setPaused(true)
          }
          if (ui.vars.something_show()) {
            if (!ui.vars.upgrade_show) {
              ui.closeOverlay()
              showOverlay()
            } else {
              ui.closeOverlay()
            }
          } else {
            if (!ui.vars.upgrade_show) {
              showOverlay()
            } else {
              ui.closeOverlay()              
            }
          }
        }
        break
      case "KeyN":
        if (ON_N) {
          player.addxp(50 * (player.level + 1))
        }
        break
      case "KeyM":
        if (ON_M) {
          waves.current++
        }
        break
    }
  })
  
  window.addEventListener("mousemove", function(event) {
    if (!playerExists()) {
      return
    }
    c.pointer = mouse.position
  })
  
  window.addEventListener("mousedown", function(event) {
    if (!playerExists()) {
      return
    }
    if ((event.buttons & 1) > 0) {
      c.shoot = true
    }
    if ((event.buttons & 2) > 0) {
      c.altshoot = true
    }
    if ((event.buttons & 4) > 0) {
      c.midshoot = true
    }
  })
  
  window.addEventListener("mouseup", function(event) {
    if (!playerExists()) {
      return
    }
    c.shoot = false
    c.altshoot = false
    c.midshoot = false
  })
}
