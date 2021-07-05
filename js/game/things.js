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
  type: "unknown",
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
  type: "basic",
  description: "A simple tower with a simple gun.",
  render: style.tower.basic,
  accessories: [
    {
      type: "guncircle",
      layer: 2,
      size: 2,
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
    upgrade: null,
  }
}

things.twin = {
  parent: ["tower"],
  label: "T-5",
  type: "twin",
  description: "Two weaker shooters side-by-side, like twins.",
  render: style.tower.tier2,
  accessories: [
    {
      type: "guncircle",
      layer: 2,
      size: 2.5,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: { 
        x: -0.65, y: 0, w: 0, h: 8.5, a: 0, d: 0, 
        style: "twin",
      },
      stat: ["shooter", "twin"],
    }, {
      set: {
        x: 0.65, y: 0, w: 0, h: 8.5, a: 0, d: 0.5,
        style: "twin",
      },
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
  type: "double",
  description: "Double the gun, double the fun!",
  render: style.tower.tier2,
  accessories: [
    {
      type: "guncircle",
      layer: 2,
      size: 2,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: { 
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0, 
        style: "double",
      },
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
  type: "big",
  description: "Slower and bigger projectiles.",
  render: style.tower.tier2,
  accessories: [
    {
      type: "guncircle",
      layer: 2,
      size: 2,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 10, a: 0, d: 0,
        style: "big",
      },
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
  type: "strong",
  description: "Faster and heavier projectiles.",
  render: style.tower.tier2,
  accessories: [
    {
      type: "guncircle",
      layer: 2,
      size: 2,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 11, a: 0, d: 0,
        style: "strong",
      },
      stat: ["shooter", "strong"],
      options: { },
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
  type: "fast",
  description: "Faster rate of fire and smaller projectiles.",
  render: style.tower.tier2,
  accessories: [
    {
      type: "guncircle",
      layer: 2,
      size: 2,
    }
  ],
  // upgrades: [],
  guns: [
    {
      set: {
        x: 0, y: 0, w: 0, h: 7, a: 0, d: 0,
        style: "fast",
      },
      stat: ["shooter", "fast"],
      options: { },
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

things.asteroid = {
  parent: ["enemy"],
  label: "Asteroid",
  type: "asteroid",
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
