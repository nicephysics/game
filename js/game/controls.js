import { config, category } from "../config/config.js"

import { Tower } from "./tower.js"

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
      case "KeyP":
        controls.setPaused(!c.paused)
        break
      case "KeyU":
        if (player.canTierUp) {
          ui.vars.tier_up_show = !ui.vars.tier_up_show
          controls.setPaused(ui.vars.tier_up_show)
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
