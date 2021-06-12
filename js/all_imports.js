// ALL IMPORTS (don't know if this will cause performance issues)

/*

// util
import { events } from "./util/events.js"
import { math } from "./util/math.js"
import { random } from "./util/random.js"
import { util_world } from "./util/world.js"

// display
import { style } from "./display/style.js"
import { display } from "./display/display.js"
import { display_view } from "./display/view.js"

// config
import { config, category } from "./config/config.js"

// game
import { Tower } from "./game/tower.js"
import { Gun } from "./game/gun.js"
import { stats, Stat } from "./game/stat.js"
import { towerstats, TowerStat } from "./game/towerstat.js"

*/

// hack for console

// game
var game = { }
import('./game/aim.js').then(m => {
  game.aim = m.aim
})
import('./game/enemy.js').then(m => {
  game.Enemy = m.Enemy
  game.enemies = m.enemies
  game.enemystats = m.enemystats
})
import('./game/gun.js').then(m => {
  game.Gun = m.Gun
})
import('./game/stat.js').then(m => {
  game.Stat = m.Stat
  game.stats = m.stats
})
import('./game/tower.js').then(m => {
  game.Tower = m.Tower
  game.towers = m.towers
})
import('./game/towerstat.js').then(m => {
  game.TowerStat = m.TowerStat
  game.towerstats = m.towerstats
})
import('./game/wave.js').then(m => {
  game.wave = m.wave
})

// display
var disp = { }
import('./display/draw.js').then(m => {
  disp.draw = m.draw
})
import('./display/view.js').then(m => {
  disp.display_view = m.display_view
})
import('./display/style.js').then(m => {
  disp.style = m.style
})
import('./display/display.js').then(m => {
  disp.display = m.display
})

// config
var config = { }
import('./config/config.js').then(m => {
  config.config = m.config
  config.category = m.category
})

// util
var util = { }
import('./util/events.js').then(m => {
  util.events = m.events
})
import('./util/math.js').then(m => {
  util.math = m.math
})
import('./util/random.js').then(m => {
  util.random = m.random
})
import('./util/world.js').then(m => {
  util.world = m.world
})
