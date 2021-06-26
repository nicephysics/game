import { category, config } from "../config/config.js"

import { style } from "../display/style.js"

if (true) {
  // 2 space indent!
}

export var things = { }

// default tower and enemy

things.tower = {
  parent: ["thing"],
  gametype: "tower",
  // matter stuff
  label: "Unknown Tower",
  static: true,
  category: category.yourTower,
  // render stuff
  shape: "circle",
  accessories: [],
  render: style.tower.default,
  // game stuff
  guns: [],
  controlType: "player",
  xp: 0,
  bonusxp: null,
}

things.enemy = {
  parent: ["thing"],
  gametype: "enemy",
  // matter stuff
  label: "Unknown Enemy",
  static: false,
  category: category.enemy,
  // render stuff
  shape: "asteroid",
  accessories: [],
  render: style.enemy.default,
  // game stuff
  guns: [],
  controlType: "enemy",
  xp: 0,
  bonusxp: 0,
}


// TOWERS

things.basic = {
  parent: ["tower"],
  label: "Basic Tower",
  render: style.tower.basic,
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "basic",
      },
      stat: ["shooter", "basic"],
      options: { },
    },
  ],
}


// ENEMIES

things.asteroid = {
  parent: ["enemy"],
  label: "Asteroid",
  render: style.enemy.asteroid,
  guns: null,
  // stats?
  xp: 10,
  bonusxp: 0.1,
}
