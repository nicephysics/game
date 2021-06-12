if (true) {
  // 2 space indent
}

var _width = window.innerWidth,
    _height = window.innerHeight

export var config = {
  version: "0.0.0",
  limits: {
    min: { x: _width * -6.0, y: 0 },
    max: { x: _width * 6.0, y: _height },
    zoom: { min: 1.0, max: 1.0 },
  }
}

var c = {
  default: 0x0001,
  ground: 0x0002,
  enemy: 0x0004,
  you_tower: 0x0008,
  enemy_tower: 0x0010,
  you_bullet: 0x0020,
  enemy_bullet: 0x0040,
  all: 0x007F, // 5 category types so far, so category.all = (2^5 - 1)
}

export var category = {
  c: c,
  mouseConstraint: {
    mask: c.ground | c.you_tower | c.enemy_tower | c.enemy | c.you_bullet | c.enemy_bullet // remove?
  },
  ground: {
    category: c.ground,
    mask: c.default | c.enemy | c.enemy_bullet | c.you_bullet
  },
  yourTower: {
    category: c.you_tower,
    mask: c.default | c.enemy | c.enemy_bullet
  },
  yourBullet: {
    category: c.you_bullet,
    mask: c.default | c.ground | c.enemy | c.enemy_tower | c.enemy_bullet
  },
  enemy: {
    category: c.enemy,
    mask: c.default | c.ground | c.you_tower | c.you_bullet | c.enemy
  },
  enemyTower: {
    category: c.enemy_tower,
    mask: c.default | c.your_bullet
  },
  enemyBullet: {
    category: c.enemy_bullet,
    mask: c.default | c.ground | c.you_tower | c.you_bullet
  },
}

config.category = category
