// #include <ioriver>
// #include "bits/std++c.h"
// #define say cout<<
// using namespace std; // no
// main() { (((say))) "Hello\xa0World!";;; }

import { Enemy } from "./enemy.js"
import { game_start } from "./start.js"
import { Tower } from "./tower.js"
import { waves } from "./waves.js"

export const save = { }

save.initial = function() {
  return {
    version: 1401
  }
}

let S = save.initial() // a constant, for convenience

save.save = function() {
  return S
}

save.fixnull = function() {
  if (S == null) {
    S = save.initial()
  }
}

save.setwave = function() {
  localStorage.setItem("game", JSON.stringify(S))
}

save.getwave = function() {
  S = JSON.parse(localStorage.getItem("game"))
  save.fixnull()
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
  save.setwave()
}

save.clearwave = function() {
  S.game = { }
  save.setwave()
}

save.loadwave = function() {
  save.getwave()
  game_start(S.game.wave.level, true)
  Tower.loadTower(S.game.tower)
  waves.current = S.game.wave.number
}

save.checkwave = function() {
  save.getwave()
  return S != null && S.game != null && S.game.tower != null
}
