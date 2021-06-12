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

controls.init = function(engine) {
  var world = engine.world,
      player = Tower.player,
      body = player.body
  
  function move(x, y) {
    player.moveBy(Vector.create(x, y))
  }
  
  document.addEventListener("keydown", function(event) {
    switch (event.code) {
      case "KeyS":
      case "ArrowDown":
        move(0, 1)
        break;
      case "KeyW":
      case "ArrowUp":
        move(0, -1)
        break;
      case "KeyA":
      case "ArrowLeft":
        move(-1, 0)
        break;
      case "KeyD":
      case "ArrowRight":
        move(1, 0)
        break;
    }
  }
}
