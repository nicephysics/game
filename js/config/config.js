export var config = {
  version: "0.0.0",
}

var c = {
  default: 0x0001,
  ground: 0x0002,
  you_tower: 0x0004,
  bad_tower: 0x0008,
  you_bullet: 0x0010,
  bad_bullet: 0x0020,
  all: 0x003F, // 5 category types so far, so category.all = (2^5 - 1)
}

export var category = {
  c: c,
  mouseConstraint: {
    mask: c.ground | c.you_tower | c.bad_tower // remove?
  },
  ground: {
    category: c.ground,
    mask: c.default | c.bad_bullet | c.you_bullet
  },
  yourTower: {
    category: c.you_tower,
    mask: c.default | c.bad_bullet
  },
  yourBullet: {
    category: c.you_bullet,
    mask: c.default | c.ground | c.bad_tower | c.bad_bullet
  },
  badTower: {
    category: c.bad_tower,
    mask: c.default | c.default | c.your_bullet
  },
  badBullet: {
    category: c.bad_bullet,
    mask: c.default | c.ground | c.you_tower | c.you_bullet
  },
}

config.category = category
