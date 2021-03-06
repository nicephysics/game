// #include <ioriver>
// #include "bits/std++c.h"
// #define say cout<<
// using namespace std; // no
// main() { (((say))) "Hello\xa0World!";;; }

import { saveversion } from "../config/version.js"

import { Enemy } from "./enemy.js"
import { game_start } from "./start.js"
import { Tower } from "./tower.js"
import { waves } from "./waves.js"

export const save = { }

save.initial = function() {
  return {
    version: saveversion
  }
}

let S = save.initial() // a constant, for convenience

save.save = function() {
  return S
}

save.checkversion = function() {
  if (S == null || S.version == null) return
  if (S.version < saveversion) {
    console.warn("Saved version (" + S.version + ") is lower than the current version (" + saveversion + ")!")
  }
}

save.fixnull = function() {
  if (S == null) {
    S = save.initial()
  }
}

save.set = function() {
  localStorage.setItem("game", JSON.stringify(S))
}

save.get = function() {
  S = JSON.parse(localStorage.getItem("game"))
  save.fixnull()
  save.checkversion()
}

save.savewave = function() {
  if (Enemy.waveOn()) return
  S.game = {
    tower: Tower.saveTower(),
    wave: {
      level: waves.levelname,
      number: waves.current,
    }
  }
  save.set()
}

save.clearwave = function() {
  S.game = { }
  save.set()
}

save.loadwave = function() {
  save.get()
  game_start(S.game.wave.level, true)
  Tower.loadTower(S.game.tower)
  waves.current = S.game.wave.number
}

save.checkwave = function() {
  save.get()
  return S != null && S.game != null && S.game.tower != null
}
