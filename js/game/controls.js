import { Enemy } from "./enemy.js"
import { Tower } from "./tower.js"
import { Thing } from "./thing.js"
import { waves } from "./waves.js"

import { math } from "../util/math.js"
import { tools } from "../util/tools.js"

import { ui } from "../display/ui.js"

export const controls = { }

const Vector = Matter.Vector

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

controls.levelupto = function(level) {
  const player = Tower.player
  // to level up one level
  // player.addxp(50 * (player.level + 1))
  // to level up to a certain level
  if (player != null) {
    player.addxp(math.towerxp(level) - player.xp)
  }
}

controls.levelup = function() {
  const player = Tower.player
  player.addxp(50 * (player.level + 1))
}

const playerExists = function() {
  return Tower.player != null
}

controls.joystick = {
  left: { },
  right: { },
}

controls.init = function(render) {
  const mouse = render.mouse,
        player = Tower.player
  
  player.control = {
    up: false,
    down: false,
    left: false,
    right: false,
    pointer: Vector.create(0, 0), // to avoid the NaN
    paused: false,
    shoot: false,
    altshoot: false,
    midshoot: false,
    autoshoot: false,
    autorotate: false,
    movedir: null,
  }
  
  var c = player.control // alias
  
  document.addEventListener("keydown", function(event) {
    if (!playerExists()) {
      return
    }
    const first = !event.repeat // unused for now
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
    // if key is pressed down for the first time (not repeated/held down)
    if (first) {
      switch (event.code) {
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
            controls.levelup()
          }
          break
        case "KeyM":
          if (ON_M) {
            waves.current++
          }
          break
      }
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
    }
  })

  const get_touches = function(touches) {
    const j = controls.joystick
    let left = null,
        right = null
    for (let touch of touches) {
      if (touch.identifier === j.left.id) {
        left = touch
      } else if (touch.identifier === j.right.id) {
        right = touch
      }
    }
    return { left: left, right: right }
  }

  const mousemove_f = function(event) {
    if (!playerExists()) {
      return
    }
    if (tools.isMobile && event.touches) {
      const j = controls.joystick
      let { left, right } = get_touches(event.touches)
      if (left != null && j.left.id != null) {
        const v = Vector.create(left.clientX - j.left.x, left.clientY - j.left.y)
        c.shoot = true
        c.altshoot = true
        c.midshoot = true
        c.pointer = Vector.add(Tower.player.position, v)
      }
      if (right != null && j.right.id != null) {
        const v = Vector.create(right.clientX - j.right.x, right.clientY - j.right.y)
        c.movedir = v
      }
    } else {
      c.pointer = mouse.position
    }
  }

  const mousedown_f = function(event) {
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
    if (tools.isMobile && event.touches) {
      const touch = event.touches[0],
            j = controls.joystick
      if (touch != null) {
        if (touch.clientX <= window.innerWidth / 2) {
          j.left.x = touch.clientX
          j.left.y = touch.clientY
          j.left.id = touch.identifier
        } else {
          j.right.x = touch.clientX
          j.right.y = touch.clientY
          j.right.id = touch.identifier
        }
      }
    }
  }

  const mouseup_f = function(event) {
    if (!playerExists()) {
      return
    }
    if (tools.isMobile && event.touches) {
      const j = controls.joystick
      let { left, right } = get_touches(event.touches)
      if (left == null) {
        j.left = { }
        c.movedir = Vector.create(0, 0)
      }
      if (right == null) {
        j.right = { }
        c.shoot = false
        c.altshoot = false
        c.midshoot = false
      }
    } else {
      c.shoot = false
      c.altshoot = false
      c.midshoot = false
    }
  }
  
  window.addEventListener("mousemove", mousemove_f)
  
  window.addEventListener("touchmove", mousemove_f)
  
  window.addEventListener("mousedown", mousedown_f)
  
  window.addEventListener("touchstart", mousedown_f)
  
  window.addEventListener("mouseup", mouseup_f)
  
  window.addEventListener("touchend", mouseup_f)
}
