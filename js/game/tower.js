// game
import { Effect } from "./effect.js"
import { enemies, Enemy } from "./enemy.js"
import { Gun } from "./gun.js"
import { Thing } from "./thing.js"
import { things } from "./things.js"
// config
import { config, category } from "../config/config.js"
// util
import { math } from "../util/math.js"
// display
import { draw } from "../display/draw.js"
import { style } from "../display/style.js"

if (true) {
  // 2 spaces indent
}

export var towers = [ ] // Tower[]

const Bodies = Matter.Bodies,
      Body = Matter.Body,
      Common = Matter.Common,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Mouse = Matter.Mouse,
      SAT = Matter.SAT,
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
    for (let u in ts.upgrades) {
      disp.push(towermap[u])
    }
    ts.displayUpgrades = disp
  }
}

export class Tower {
  // static
  static towermap = towermap
  
  static player = null
  static health = 10
  
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
      t.createShape()
      t.createBody()
      t.exists = true
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
  
  // fields
  thing = null
  
  // constructor
  constructor(position, parent) {
    // nothing for now
    this.thing = new Thing(position, parent)
  }
}
