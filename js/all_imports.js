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
var a, e, g, s, t, ts
import('./game/aim.js').then(m => a = m)
import('./game/enemy.js').then(m => e = m)
import('./game/gun.js').then(m => g = m)
import('./game/stat.js').then(m => s = m)
import('./game/tower.js').then(m => t = m)
import('./game/towerstat.js').then(m => ts = m)
