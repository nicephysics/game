import { config, category } from "../config/config.js"

import { Tower } from "./tower.js"

if (true) {
  // 2 space indent!
}

export var controls = { }

var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector

controls.init = function(render) {
  var engine = render.engine,
      mouse = render.mouse,
      world = engine.world,
      player = Tower.player,
      body = player.body
  
  var direction = Vector.create(0, 0)
  
  player.control = {
    up: false,
    down: false,
    left: false,
    right: false,
    pointer: Vector.create(0, 0), // to avoid the classic NaN
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
