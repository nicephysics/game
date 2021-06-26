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
import('./game/collide.js').then(m => {
  game.collide = m.collide
})
import('./game/controller.js').then(m => {
  game.Controller = m.Controller
})
import('./game/controls.js').then(m => {
  game.controls = m.controls
})
import('./game/effect.js').then(m => {
  game.Effect = m.Effect
  game.effects = m.effects
})
import('./game/enemy.js').then(m => {
  game.Enemy = m.Enemy
  game.enemies = m.enemies
})
import('./game/enemystat.js').then(m => {
  game.EnemyStat = m.EnemyStat
  game.enemystats = m.enemystats
})
import('./game/gun.js').then(m => {
  game.Gun = m.Gun
})
import('./game/gunset.js').then(m => {
  game.gunset = m.gunset
})
import('./game/stat.js').then(m => {
  game.Stat = m.Stat
  game.stats = m.stats
})
import('./game/thing.js').then(m => {
  game.Thing = m.Thing
  game.everything = m.everything
})
import('./game/things.js').then(m => {
  game.things = m.things
})
import('./game/thingstat.js').then(m => {
  game.ThingStat = m.ThingStat
})
import('./game/tower.js').then(m => {
  game.Tower = m.Tower
  game.towers = m.towers
})
import('./game/towerstat.js').then(m => {
  game.TowerStat = m.TowerStat
  game.towerstats = m.towerstats
})
import('./game/update.js').then(m => {
  game.update = m.update
})
import('./game/wave.js').then(m => {
  game.wave = m.wave
})
import('./game/waves.js').then(m => {
  game.waves = m.waves
})

// display
var disp = { }
import('./display/draw.js').then(m => {
  disp.draw = m.draw
})
import('./display/navigation.js').then(m => {
  disp.navigation = m.navigation
})
import('./display/style.js').then(m => {
  disp.style = m.style
})
import('./display/display.js').then(m => {
  disp.display = m.display
})
import('./display/ui.js').then(m => {
  disp.ui = m.ui
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
