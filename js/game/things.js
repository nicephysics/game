import { category, config } from "../config/config.js"

import { style } from "../display/style.js"

if (true) {
  // 2 space indent!
}

export var things = { }

// default things

things.thing = {
  type: "unknown",
  // nothing else to predefine
}

things.tower = {
  parent: ["thing"],
  gametype: "tower",
  // matter stuff
  label: "Unknown Tower",
  type: "unknown",
  static: true,
  category: category.yourTower,
  // render stuff
  shape: 6,
  shapeAngle: 30,
  accessories: [],
  render: style.tower.default,
  // game stuff
  guns: [],
  controlType: "player",
  bonusxp: null,
  stat: {
    tier: 0,
    size: 25,
    speed: 5,
    rotspeed: 0.2,
    upgradetext: "normal",
    upgradestr: {},
    upgrade: null,
  }
}

things.enemy = {
  parent: ["thing"],
  gametype: "enemy",
  // matter stuff
  label: "Unknown Enemy",
  type: "unknown",
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
    tier: -1,
    size: 10,
    mass: 1,
    speed: 1,
    rotspeed: 0.2,
    air: 1,
    gravity: 1,
    upgradetext: "normal",
    upgrade: null,
    bulletMult: {
      size: 1,
      mass: 1,
      speed: 1,
      reload: 1,
      spread: 1,
      air: 1,
      rot: 1,
    }
  }
}


// TOWERS

things.basic = {
  parent: ["tower"],
  label: "G-0",
  description: "A simple tower with a simple gun.",
  render: style.tower.basic,
  accessories: [
    {
      layer: 2,
      type: "gunshape",
      size: 1.6,
      shape: 0,
    }
  ],
  upgrades: ["twin", "fast", "big", "strong", "double"],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "basic",
      },
      type: "projectile",
      stat: ["shooter", "basic"],
      options: { },
    },
  ],
  stat: {
    tier: 1,
    size: 25,
    speed: 5,
    rotspeed: 0.2,
    upgradetext: "normal",
    upgrademax: { size: 5, mass: 5, speed: 5, reload: 5, thingspeed: 5, },
    upgrade: null,
  }
}

things.twin = {
  parent: ["tower"],
  label: "T-5",
  description: "Two weaker shooters side-by-side, like twins.",
  render: style.tower.tier2,
  accessories: [
    {
      layer: 2,
      type: "gunshape",
      size: 2.4,
      shape: 0,
      centre: true,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: { 
        x: -0.65, y: 0, w: 0, h: 8.5, a: 0, d: 0, 
        style: "twin",
      },
      type: "projectile",
      stat: ["shooter", "twin"],
    }, {
      set: {
        x: 0.65, y: 0, w: 0, h: 8.5, a: 0, d: 0.5,
        style: "twin",
      },
      type: "projectile",
      stat: ["shooter", "twin"],
    },
  ],
  stat: {
    tier: 2,
    size: 25,
    speed: 5.02,
    rotspeed: 0.2,
    upgradetext: "normal",
  }
}

things.double = {
  parent: ["tower"],
  label: "D-1",
  description: "Double the gun, double the fun!",
  render: style.tower.tier2,
  accessories: [
    {
      layer: 2,
      type: "gunshape",
      size: 2,
      shape: 0,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: { 
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0, 
        style: "double",
      },
      type: "projectile",
      stat: ["shooter", "double"],
    }, {
      set: {
        x: 0, y: 0, w: 0, h: 8, a: 0, d: 0.5,
        style: "double",
      },
      type: "projectile",
      stat: ["shooter", "double"],
    },
  ],
  stat: {
    tier: 2,
    size: 25,
    speed: 5.16,
    rotspeed: 0.2,
    upgradetext: "normal",
  }
}

things.big = {
  parent: ["tower"],
  label: "B-4",
  description: "Slower and bigger projectiles.",
  render: style.tower.tier2,
  accessories: [
    {
      layer: 2,
      type: "gunshape",
      size: 2,
      shape: 0,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "big",
      },
      type: "projectile",
      stat: ["shooter", "big"],
      options: { },
    },
  ],
  stat: {
    tier: 2,
    size: 28,
    speed: 5,
    rotspeed: 0.18,
    upgradetext: "normal",
  }
}

things.strong = {
  parent: ["tower"],
  label: "S-3",
  description: "Faster and heavier projectiles.",
  render: style.tower.tier2,
  accessories: [
    {
      layer: 2,
      type: "gunshape",
      size: 2,
      shape: 0,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 11, a: 0, d: 0,
        style: "strong",
      },
      type: "projectile",
      stat: ["shooter", "strong"],
    },
  ],
  stat: {
    tier: 2,
    size: 27,
    speed: 4.6,
    rotspeed: 0.175,
    upgradetext: "normal",
  }
}

things.fast = {
  parent: ["tower"],
  label: "F-2",
  description: "Faster rate of fire and smaller projectiles.",
  render: style.tower.tier2,
  accessories: [
    {
      layer: 2,
      type: "gunshape",
      size: 2,
      shape: 0,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 7, a: 0, d: 0,
        style: "fast",
      },
      type: "projectile",
      stat: ["shooter", "fast"],
    },
  ],
  stat: {
    tier: 2,
    size: 24,
    speed: 5.3,
    rotspeed: 0.22,
    upgradetext: "normal",
  }
}


// ENEMIES

things.ball = {
  parent: ["enemy"],
  label: "Ball (Test)",
  shape: "circle",
  render: style.enemy.ball,
  enemy_random: true,
  guns: null,
  // stats?
  xp: 20,
  bonusxp: 0.2,
  enemyDamage: 1,
  stat: {
    tier: -1,
    size: 15,
    speed: 1,
    rotspeed: 0.2,
  }
}

things.ballgun = {
  parent: ["enemy"],
  label: "Ballgun (Test)",
  shape: "circle",
  render: style.enemy.ball,
  controlType: "enemy_aim",
  guns: [
    { 
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "ballgun",
      },
      type: "bullet",
      stat: ["enemy", "enemyshooter", "ballgun"],
    },
  ],
  // stats?
  xp: 40,
  bonusxp: 0.4,
  enemyDamage: 1,
  stat: {
    tier: -1,
    size: 25,
    speed: 1,
    rotspeed: 0.2,
  }
}

things.asteroid = {
  parent: ["enemy"],
  label: "Asteroid",
  render: style.enemy.asteroid,
  enemy_random: true,
  guns: null,
  // stats?
  xp: 10,
  bonusxp: 0.1,
  enemyDamage: 1,
  stat: {
    tier: -1,
    size: 20,
    speed: 1,
    rotspeed: 0.2,
  }
}

// BULLETS

things.projectile = {
  parent: ["thing"],
  label: "Projectile",
  gametype: "projectile",
  // matter stuff
  static: false,
  isBullet: true,
  category: category.yourBullet,
  // render stuff
  shape: "circle",
  accessories: null,
  render: style.projectile.bullet,
  guns: null,
  xp: 0,
  bonusxp: 0,
  stat: null,
}

things.bullet = {
  parent: ["thing"],
  label: "Enemy Bullet",
  gametype: "bullet",
  // matter stuff
  static: false,
  isBullet: true,
  category: category.enemyBullet,
  // render stuff
  shape: "circle",
  accessories: null,
  render: style.bullet.bullet,
  guns: null,
  xp: 0,
  bonusxp: 0,
  stat: null,
}


for (let k in things) {
  if (things[k].type == null) {
    things[k].type = k
  }
}
