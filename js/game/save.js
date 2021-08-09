// #include <ioriver>
// #include "bits/std++c.h"
// #define say cout<<
// using namespace std; // no
// main() { (((say))) "Hello\xa0World!";;; }

import { game_start } from "./start.js"
import { Tower } from "./tower.js"
import { waves } from "./waves.js"

export const save = { }

let S = { } // a constant, for convenience

save.save = function() {
  return S
}

save.setwave = function() {
  localStorage.setItem("game", JSON.stringify(S))
}

save.getwave = function() {
  S = JSON.parse(localStorage.getItem("game"))
}

save.savewave = function() {
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
  game_start(S.game.wave.level)
  Tower.loadTower(S.game.tower)
  waves.current = S.game.wave.number
}

save.checkwave = function() {
  save.getwave()
  return S.game != null && S.game.tower != null
}
