import { config, category } from "../config/config.js"

import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"
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

controls.setPaused = function(paused) {
  const player = Tower.player
  player.control.paused = paused
  Tower.runner.enabled = !paused
}

controls.isPaused = function() {
  const player = Tower.player
  return player.control.paused  
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
        player.addxp(50 * (player.level + 1))
        break
    }
  })
  
  window.addEventListener("mousemove", function(event) {
    c.pointer = mouse.position
  })
  
  window.addEventListener("mousedown", function(event) {
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
    c.shoot = false
    c.altshoot = false
    c.midshoot = false
  })
}
