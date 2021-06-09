// imports

if (true) {
  // 2 spaces
}

var Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Vector = Matter.Vector

export var guns = [ ] // Gun[]

export class Gun {
  // static
  static set = { } // to be filled later
  
  // fields
  tower = null
  position = Vector.create(0, 0)
  size = Vector.create(0, 0)
  direction = 0
  shape = "rectangle"
  aspects = {}
  
  // constructor
  constructor(tower, set) {
    this.tower = tower
    this.setLocation(set)
  }
  
  // get
  
  // set
  
  // go!
  draw(render) {
    // very huge todo
    switch (this.shape) {
      case "rectangle":
        break;
    }
  }
  
  setLocation(set) {
    this.position = Vector.create(set.x, set.y)
    this.size = Vector.create(set.w, set.h)
    this.direction = set.d || 0
    this.shape = set.s || "rectangle"
    this.aspects = set.aspects || { }
  }
}

Gun.set.some_random_comments = {
  x: 0, // position.x
  y: 0, // position.y
  w: 20, // size.x
  h: 50, // size.y
  d: 0, // direction (default: 0)
  s: "", // shape (default: rectangle)
  aspects: { } // shape aspects (default: nothing)
}

Gun.set.default = {
  x: 0, y: 0, w: 20, h: 50, d: 0, s: "rectangle",
}
