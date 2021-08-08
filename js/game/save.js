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

save.wave = function() {
  S.game = {
    player: Tower.saveTower(),
  }
  save.set()
}
