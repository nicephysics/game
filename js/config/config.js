export var config = {
  version: "0.0.0",
}

var c = {
  ground: 0x0001,
  mouse: 0x0002,
  you_tower: 0x0004,
  bad_tower: 0x0008,
  you_bullet: 0x0016,
  bad_bullet: 0x0032,
  all: 0x0031, // 5 category types so far, so category.all = (2^5 - 1)
}

export var category = {
  c: c,
  mouseConstraint: {
    mask: c.you_tower // remove?
  },
  ground: {
    category: c.ground,
    mask: c.bad_bullet | c.you_bullet
  },
  yourTower: {
    category: c.you_tower,
    mask: c.bad_bullet
  },
  yourBullet: {
    category: c.you_bullet,
    mask: c.ground | c.bad_tower | c.bad_bullet
  },
  badTower: {
    category: c.bad_tower,
    mask: c.your_bullet
  },
  badBullet: {
    category: c.bad_bullet,
    mask: c.ground | c.you_tower | c.you_bullet
  },
}

config.category = category
