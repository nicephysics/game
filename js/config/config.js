export var config = {
  version: "0.0.0",
}

var c = {
  wall: 0x0001,
  you: 0x0002,
  bad: 0x0004,
  mouse: 0x0008,
  bullet: 0x0016,
  all: 0x0031, // 5 category types so far, so category.all = (2^5 - 1)
}

export var category = {
  c: c,
  mouseConstraint: {
    mask: c.mouse
  },
  ground: {
    category: c.wall,
    mask: c.bad | c.you | c.bullet
  },
  yourTower: {
    category: c.you | c.wall | c.mouse, // remove c.mouse
    mask: c.bad
  },
  yourBullet: {
    category: c.you | c.bullet,
    mask: c.bad | c.wall | c.bullet
  },
  badTower: {
    category: c.bad | c.wall,
    mask: c.bad
  },
  badBullet: {
    category: c.bad | c.bullet,
    mask: c.you | c.wall | c.bullet
  },
}

config.category = category
