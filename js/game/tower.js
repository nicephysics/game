// game
import { Thing } from "./thing.js"
import { things } from "./things.js"
// util
import { math } from "../util/math.js"
// display
import { style } from "../display/style.js"

if (true) {
  // 2 spaces indent
}

export var towers = [ ] // Tower[]

const Body = Matter.Body,
      Vector = Matter.Vector

export const towermap = {
  basic: "G-0",
  double: "D-1",
  fast: "F-2",
  big: "B-3",
  strong: "S-4",
  twin: "T-5",
}

for (let key in towermap) {
  const k = towermap[key]
  if (towermap.hasOwnProperty(k)) {
    console.error("Tower map already has the label '" + k + "'!")
    continue
  } else {
    towermap[k] = key
  }
}

for (let key in towermap) {
  const ts = things[key]
  if (ts != null && ts.upgrades != null) {
    const disp = []
    for (let u of ts.upgrades) {
      disp.push(towermap[u])
    }
    ts.displayUpgrades = disp
  }
}

export class Tower {
  // static
  static towermap = towermap // ok
  
  static player = null // the main player!
  
  static health = 10
  static score = 0
  
  static tick() {
    // wow nothing here!
  }
  
  static drawtowers = {}
  
  static drawTower(render, x, y, size, label) {
    let type = towermap[label],
        t = Tower.drawtowers[type],
        s = style.tower[type]
    const mousepos = render.mouse.absolute,
          ctx = render.context
    if (!t) {
      t = new Thing(Vector.create(0, 0))
      t.make(things[type])
      t.createTemp()
      Tower.drawtowers[type] = t
    }
    // set body attributes, fit the draw
    t.body.position = {
      x: x + render.bounds.min.x,
      y: y + render.bounds.min.y,
    }
    t.targetrot = Vector.angle(Vector.create(x, y), mousepos)
    Body.setAngle(t.body, math.lerpAngle(t.angle, t.targetrot, t.stat.rotspeed))
    t.stat.size = size
    t.draw(render)
  }
  
  static saveTower(tower = Tower.player) {
    if (tower == null) {
      console.error("Tower to save is null!")
      return { }
    }
    return {
      type: tower.type,
      stat: tower.stat.save(),
      position: tower.position,
      xp: tower.xp,
      score: Tower.score,
      health: Tower.health,
      // TODO more things
    }
  }
  
  static loadTower(o) {
    if (Tower.player) {
      Tower.player.remove()
    }
    const tower = Tower.player
    tower.make(things[o.type])
    tower.create()
    tower.stat.load(o.stat)
    tower.position = o.position
    tower.xp = 0
    tower.addxp(o.xp)
    Tower.health = o.health
    Tower.score = o.score
    Tower.player = tower
  }
}
