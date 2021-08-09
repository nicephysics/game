// #include <ioriver>
// #include "bits/std++c.h"
// #define say cout<<
// using namespace std; // no
// main() { (((say))) "Hello\xa0World!";;; }

import { Tower } from "./tower.js"
import { waves } from "./waves.js"

export const save = { }

save.save = {
  game: { },
}
const S = save.save // a constant, for convenience

save.set = function() {
  localStorage.setItem("game", JSON.stringify(S))
}

save.get = function() {
  save.save = JSON.parse(localStorage.getItem("game"))
}

save.setwave = function() {
  S.game = {
    tower: Tower.saveTower(),
    wave: waves.current,
  }
  save.set()
}

save.clearwave = function() {
  S.game = {}
  save.set()
}

save.getwave = function() {
  save.get()
  Tower.loadTower(S.game.tower)
  waves.current = S.game.wave
}

save.checkwave = function() {
  save.get()
  return S.game != null && S.game.tower != null
}
