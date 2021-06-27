import { category, config } from "../config/config.js"

import { style } from "../display/style.js"

if (true) {
  // 2 space indent!
}

export var things = { }

// default things

things.thing = {
  // nothing to predefine
}

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
  stat: {
    tier: 0,
    size: 25,
    speed: 5,
    rotspeed: 0.2,
    upgradetext: "normal",
    upgrade: null,
  }
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
  enemyDamage: 1,
  stat: {
    size: 25,
  }
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
  stat: {
    tier: 0,
    size: 25,
    speed: 5,
    rotspeed: 0.2,
    upgradetext: "normal",
    upgrade: null,
  }
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
  enemyDamage: 1,
  stat: {
    tier: -1,
    size: 10,
    speed: 1,
    rotspeed: 0.2,
    upgradetext: "normal",
    upgrade: null,
  }
}

// BULLETS

things.projectile = {
  parent: ["thing"],
  label: "Projectile",
  // matter stuff
  static: false,
  isBullet: true,
  category: category.yourBullet,
  // render stuff
  shape: "circle",
  accessories: null,
  render: style.projectile.default,
  guns: null,
  xp: 0,
  bonusxp: 0,
  stat: null,
}
