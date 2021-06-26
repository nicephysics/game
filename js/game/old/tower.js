// just an archived file...

/*

# How to use class: Tower

## IMPORTANT!
Initialize the class first by calling:
Tower.init(render);

## Initialization
var tower = new Tower(); // basic tower
var tower = new Tower(type); // specify type of tower
var tower = new Tower(type, parent); // parent's parent will be taken, if any

*/

export class Tower {
  // ##### tower static fields
  
  // reference to all towers
  static allTowers = towers
  static towers = towers
  
  // player
  static player = null
  static health = 10
  
  // a running number for ID and default label
  static _count = 1
  
  // all tower types (string) in an array
  static types = [
    "basic",
  ]
  
  // map from type to kind
  static kinds = {
    basic: "shooter",
  }
  
  // draw all guns (and other stuff related to towers not already drawn by matter renderer)
  static drawAll() {
    const render = Thing.render
    towers.forEach((tower) => {
      tower.guns.forEach((gun) => {
        gun.draw(render)
      })
      tower.draw(render)
      tower.effect.draw(render)
    })
  }
  
  // tick all guns and towers
  static tickAll() {
    towers.forEach((tower) => {
      tower.guns.forEach((gun) => {
        gun.tick()
      })
      tower.tick()
    })
  }
  
  static getType(label) {
    return towermap[label] || console.error("Invalid tower label: " + label)
  }
  
  static drawtowers = {}
  static drawTower(render, x, y, size, label) {
    let type = Tower.getType(label),
        t = Tower.drawtowers[type],
        s = style.tower[type],
        ctx = render.context,
        mousepos = render.mouse.absolute
    if (!t) {
      t = new Tower(type, null, false)
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
    // all this just for drawOverlay?
    // ah yes
    draw.setFill(ctx, s.fillStyle)
    draw.setStroke(ctx, s.strokeStyle)
    draw.setLineWidth(ctx, s.lineWidth)
    ctx.save() // for restoration purposes
    draw.setGlobalAlpha(ctx, s.opacity)
    t.drawOverlay(render) // draw the tower shape! 
    ctx.restore()
    // ok now for the more normal drawing function(s)
    for (let g of t.guns) {
      // draw guns
      g.draw(render)
    }
    // draw tower
    t.draw(render)
  }
  // ##### end tower static fields
  
  // ##### tower public instance fields
  id = Tower._count++ // integer, also increment Tower.create_count
  label = "Tower #" + (this.id).toString(10) // default (string) label for towers, uses base 10
  type = "basic" // default (string) tower type is basic
  target = null // the enemy target of the tower
  targetrot = 0 // target rotation of tower
  targetpos = Vector.create(0, 0) // target position of tower
  parent = this // Tower
  guns = [ ] // Gun[]
  xp = 0
  level = 1
  stat = new TowerStat(this) // TowerStat
  effect = new Effect(this, "tower")
  // player stuffs
  isPlayer = false
  control = {}
  // matter instances
  body = null // Matter.Body
  // ##### end tower public instance fields
  
  constructor(type = "basic", parent = this, add = true) {
    if (add) {
      towers.push(this)
    }
    this.type = type || "basic"
    this.parent = (parent) ? ( parent.parent || (parent || this) ) : this
    this.stat.setType(this.type)
    this.createBody(true, add)
  }
  
  // ##### tower getter functions
  // gets the kind of the tower
  get kind() {
    return Tower.kinds[this.type]
  }
  // returns the tower body's current position (as a Matter.Vector)
  get position() {
    return this.body.position
  }
  // returns the tower body's current angle
  get rotation() {
    return this.body.angle
  }
  // alias for this.rotation
  get angle() {
    return this.body.angle
  }
  // alias for this.targetrot
  get direction() {
    return this.targetrot
  }
  // this.position's x-coordinate
  get x() {
    return this.position.x
  }
  // this.position's y-coordinate
  get y() {
    return this.position.y
  }
  get tier() {
    return this.stat.tier
  }
  get size() {
    return this.stat.size
  }
  get canvas() {
    return Thing.render.canvas
  }
  get gravity() {
    return Thing.engine.gravity
  }
  get projectileSpeed() {
    return this.guns[0].stat.speed
  }
  get canTierUp() {
    if (this.tier <= 0) {
      console.error("Tower's tier is " + this.tier + "!")
      return true
    } else {
      return towerlevels.tier[this.tier - 1] <= this.level // todo
    }
  }
  // ##### end of tower getter functions
  
  // ##### tower setter functions
  set label(label) {
    this.body.label = label
  }
  set isPlayer(boolean) {
    this.body.canDrag = !boolean
  }
  // ##### end of tower setter functions
  
  // go!
  
  tick() {
    Body.setAngle(this.body, math.lerpAngle(this.angle, this.targetrot, this.stat.rotspeed))
    Body.setPosition(this.body, math.lerpVector(this.position, this.targetpos, config.smooth.tower.pos))
    if (this.isPlayer) {
      this.doControl()
    }
  }
  
  doControl() {
    let c = this.control,
        movedir = Vector.create(0, 0)
    // move direction
    if (c.up) movedir.y--
    if (c.down) movedir.y++
    if (c.left) movedir.x--
    if (c.right) movedir.x++
    // move variables
    var speed = this.stat.realspeed * (this.effect.speedmult || 0),
        moveVector = Vector.mult(Vector.normalise(movedir), speed),
        moveResult = Vector.add(this.targetpos, moveVector)
    // move limits
    if (moveResult.x - this.size < config.movelimits.min.x) moveResult.x = config.movelimits.min.x + this.size
    if (moveResult.y - this.size < config.movelimits.min.y) moveResult.y = config.movelimits.min.y + this.size
    if (moveResult.x + this.size > config.movelimits.max.x) moveResult.x = config.movelimits.max.x - this.size
    if (moveResult.y + this.size > config.movelimits.max.y) moveResult.y = config.movelimits.max.y - this.size
    // move!
    this.targetpos = moveResult
    // rotate!
    if (this.effect.canturn) {
      if (c.autorotate) {
        this.targetrot += 0.015
      } else {
        this.targetrot = Vector.angle(this.position, c.pointer)
      }
    }
  }
  
  draw(render) {
    let ctx = render.context,
        circleStyle
    switch (this.type) {
      case "basic":
      case "double":
      case "big":
      case "strong":
      case "fast":
        circleStyle = style.gun[this.type]
        draw.setFillDarkenStroke(ctx, circleStyle)
        draw.circle(render, this.x, this.y, this.guns[0].stat.size * 2)
        break
      case "twin":
        circleStyle = style.gun.twin
        draw.setFillDarkenStroke(ctx, circleStyle)
        draw.circle(render, this.x, this.y, this.guns[0].stat.size * 2.5)
        // draw.rectangle(render, this.x, this.y, this.size... todo
        break
    }
  }
  
  drawOverlay(render) {
    // assume all towers are circular...
    draw.circle(render, this.x, this.y, this.size)
  }
  
  refresh() {
    this.stat.setType(this.type)
    this.refreshBody() // minus attributes
  }
  
  refreshBody() {
    this.removeBody()
    this.createBody()
  }
  
  refreshLevel() {
    this.level = math.towerlevel(this.xp)
  }
  
  createBody(zero = false, addToWorld = true) {
    let x, y
    if (zero) {
      x = 0
      y = 0
    } else {
      x = this.x
      y = this.y
    }
    this.body = Bodies.circle(x, y, this.size, {
      isStatic: true,
      label: "Tower Body #" + this.id + " (" + this.type + ")",
      collisionFilter: category.yourTower,
      render: style.tower[this.type],
    })
    this.body.gametype = "tower"
    this.body.tower = this
    this.body.canDrag = !this.isPlayer
    this.body.gravityScale = 1
    // add to world
    if (addToWorld) {
      Composite.add(Thing.world, this.body)
    }
  }
  
  removeBody() {
    if (this.body != null) {
      // remove from world
      Composite.remove(Thing.world, this.body)
      return true
    } else {
      return false
    }
  }
  
  addGun(gunset, gunstat, options = { }) {
    let gun = Gun.create(this, gunset, "tower")
    gun.setStatString(gunstat)
    this.guns.push(gun)
    return gun
  }
  
  removeAllGuns() {
    for (let gun of this.guns) {
      gun.remove(false)
    }
    this.guns = [ ]
  }
  
  // don't use for now
  tickTarget() {
    if (this.target && this.target.exists) {
      let angle = aim.angle(this, this.target)
      if (angle === "fail") {
        angle = this.getTarget()
      }
      this.targetrot = angle || this.targetrot + 0.01
    } else {
      this.targetrot += 0.01
      this.getTarget()
    }    
  }
  
  // for tickTarget() above, don't use for now
  getTarget() {
    this.target = null
    if (enemies.length === 0) return false
    let angle = 0
    for (let enemy of enemies) {
      angle = aim.angle(this, enemy)
      if (angle !== "fail") {
        this.target = enemy
        return angle
      }
    }
    return false
  }
  
  // important! if not, the body will stay at 0, 0
  moveTo(x, y) {
    this.targetpos = Vector.create(x, y)
    Body.setPosition(this.body, Vector.create(x, y))
  }
  
  moveBy(x, y) {
    this.targetpos = Vector.add(this.targetpos, Vector.create(x, y))
  }
  
  moveByVector(v) {
    this.targetpos = Vector.add(this.targetpos, v)
  }
  
  turnTo(angle) {
    this.targetrot = angle
  }
  
  addxp(add) {
    this.xp += add
    Tower.xp += add
    this.stat.refreshPoints()
  }
  
  // contemplationOfMortality
}
