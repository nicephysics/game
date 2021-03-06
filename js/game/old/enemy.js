// just somewhere to dump old code...

/*
export class Enemy {
  // static
  static stats = enemystats
  static enemies = enemies
  
  static init = function() {
    document.addEventListener("keydown", function(event) {
      switch (event.code) {
        case "Digit1":
          Enemy.sendwavemaker(wave.make(["ball"], 1, { }), 1)
          break
        case "Digit2":
          Enemy.sendwavemaker(wave.make(["ballgun"], 1, { }), 1)
          break
        case "Digit3":
          Enemy.sendwavemaker(wave.make(["asteroid"], 1, { }), 1)
          break
      }
    })
  }
  
  static spawn = {
    count: 0,
    queue: new PriorityQueue( // spawn queue
      // comparison
      (a, b) => { return a.time < b.time }
    ),
    random: function(size) {
      const b = getSpawnBounds(size), // bounds
            ans = Vector.create(
              b.x + random.randreal() * b.w,
              b.y + random.randreal() * b.h
            )
      return ans
    }
  }
  
  static waveOn = function() {
    return (enemies.length > 0 || Enemy.spawn.queue.size() > 0)
  }
  
  static time = 0
  static tick() {
    Enemy.time++ // look above
    // tick all enemies
    for (let e of enemies) {
      for (let g of e.guns) {
        g.tick()
      }
      e.tick()
    }
    // check spawn queue
    const q = Enemy.spawn.queue
    while (q.size() > 0 && q.peek().time < Enemy.time) {
      let item = q.peek()
      Enemy.send(item.type, item.options)
      q.pop()
    }
  }
  
  static draw() {
    const render = Thing.render
    for (let e of enemies) {
      for (let g of e.guns) {
        g.draw(render)
      }
      e.effect.draw(render)
      e.draw(render)
    }
  }
  
  // for drawEnemy and redrawEnemy
  static drawEnemies = {} // basically a Map<String, Thing>
  
  static drawEnemy(render, x, y, size, type, options) {
    let e = Enemy.drawEnemies[type],
        s = style.enemy[type]
    const ctx = render.context,
          mousepos = render.mouse.absolute,
          time = ui.vars.time
    if (!e) {
      e = new Enemy(type)
      e.createShape()
      Enemy.drawEnemies[type] = e
    }
    e.init(options)
    e.stat.size = size
    const X = x + render.bounds.min.x,
          Y = y + render.bounds.min.y
    e.body = Bodies.circle(X, Y, size, { isStatic: true })
    e.targetrot = math.degToRad( (ui.vars.time * 0.5) % 360 )
    Body.setAngle(e.body, e.targetrot)
    draw.setFill(ctx, s.fillStyle || "transparent")
    draw.setStroke(ctx, s.strokeStyle || "transparent")
    draw.setLineWidth(ctx, s.lineWidth || 3)
    ctx.save() // ctx.restore()
    draw.setGlobalAlpha(ctx, s.opacity || 1)
    e.drawOverlay(render, X, Y) // enemy shape!
    ctx.restore()
    for (let g of e.guns) {
      // draw guns
      g.draw(render)
    }
    // draw enemy
    e.draw(render)
    return e
  }
  
  static redrawEnemy(type, options = null) {
    let e = Enemy.drawEnemies[type]
    if (e) {
      e.createShape()
      if (options) {
        e.init(options)
      }
      return e
    } else {
      return null
    }
  }
  
  static send(type, options) {
    var e = new Enemy(type, options)
    e.createShape()
    e.send()
  }
  
  static sendNumber(type, number, sep, options = { }) {
    var q = Enemy.spawn.queue,
        time = Enemy.time
    for (let i = 0; i < number; i++) {
      q.push({
        time: time,
        type: type,
        options: options,
      })
      time += sep * config.FPS
    }
  }
  
  static sendwave(w) {
    const type = w.type || w.t || "ball",
          num = w.number || w.n || 1,
          sep = w.sep || w.s || 1
    // w.difficulty = w.difficulty || w.d || w.diff || 1
    // um
    Enemy.sendNumber(type, num, sep, w) // options
  }
  
  static sendwavemaker(wavemaker, num) {
    var w = wavemaker.wave(num)
    if (w.count !== num) {
      console.error("Wave numbers don't match!", w, wavemaker)
    }
    Enemy.sendNumber(w.type, w.number, w.sep, {
      difficulty: w.difficulty,
      rand: w.rand,
    })
  }
  
  // fields
  id = Enemy.spawn.count++
  label = "Enemy #" + this.id
  body = null // Matter.Body
  type = "ball"
  targetrot = 0 // target rotation...
  controlType = "none" // controller (class IO, remember?)
  control = { }
  guns = [ ] // Gun[]
  start = Vector.create(0, 0)
  exists = false
  vertices = [ ] // Matter.Vector[]
  stat = new EnemyStat(this)
  effect = new Effect(this, "enemy")
  
  // constructor
  constructor(type, options, add = true) {
    options = options || { }
    this.type = type
    this.init(options)
  }
  
  // get
  get position() {
    return this.body.position
  }
  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
  }
  get velocity() {
    return this.body.velocity
  }
  get size() {
    return this.stat.size
  }
  // returns the enemy body's current angle
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
  
  // set
  
  // go!
  init(options) {
    this.initstats(options)
    this.start = Enemy.spawn.random(this.size)
  }
  
  initstats(options) {
    this.stat.refresh()
    this.stat.setOptions(options)
  }
  
  tick() {
    this.doControl()
    this.tickCheck()
  }
  
  doControl() {
    switch (this.controlType) {
      case "aim_player":
        // aim at the player!
        Body.setAngle(this.body, math.lerpAngle(this.angle, this.targetrot, config.smooth.enemy.rot * this.stat.mult.enemyrot))
        this.targetrot = Vector.angle(this.position, Tower.player.position)
    }
  }
  
  tickCheck() {
    const remove_addXP = () => {
      let pos = Vector.sub(this.position, Vector.mult(Vector.normalise(this.velocity), 50)), // 50 pixels of velocity
          bonus = Math.floor(Vector.magnitude(this.velocity)),
          reward = this.stat.reward + Math.round( (this.stat.bonus || 0) * bonus),
          color = "#b09f1c", // darkish yellow colour
          size = 13, // default font size 13
          time = 2, // default text time = 2 seconds
          mult = 1
      if (!this.body.hitByProjectile) {
        mult *= 2
        color = "#00ab17" // darkish green colour
        size += 3 // font size 16
        time += 1 // time = 3 seconds
      }
      ui.vars.enemy_texts.push({
        x: pos.x,
        y: pos.y,
        text: "+" + math.number(reward * mult),
        size: size,
        fill: color,
        stroke: "transparent",
        lineWidth: 0,
        angle: math.degToRad(random.randint(-15, 15)),
        time: ui.vars.time + time * config.FPS,
      })
      Tower.player.addxp(reward * mult)
      this.remove()
    }
    if (this.y < this.size && this.velocity.y <= 0) {
      remove_addXP()
    } else if (this.x < this.size && this.velocity.x <= 0 && this.velocity.y <= -this.velocity.x) {
      remove_addXP()
    } else if (this.x > Thing.render.options.width + this.size && this.velocity.x >= 0 && this.velocity.y <= this.velocity.x) {
      remove_addXP()
    }
  }
  
  draw(render) { // over
    // nothing for now
    // todo
  }
  
  drawOverlay(render, x, y, angle) {
    // todo shape
    x = x || this.x
    y = y || this.y
    angle = angle || this.angle
    switch (this.stat.shape) {
      case "circle":
        // circle for now
        draw.circle(render, x, y, this.size)
        // haha rotate circle
        break
      case "asteroid":
        // draw stored vertices
        const vertices = []
        for (let v of this.vertices) {
          vertices.push(Vector.create(v.x + x, v.y + y))
        }
        draw.polygon(render, vertices, angle)
        break
    }
  }
  
  send() {
    this.exists = true
    enemies.push(this)
    this.createBody()
  }
  
  remove() {
    this.exists = false
    this.removeBody()
    this.removeAllGuns()
    const index = enemies.indexOf(this)
    if (index > -1) {
      enemies.splice(index, 1)
    } else {
      console.error("Enemy to remove not found in 'enemies' list: ", enemy)
    }
  }
  
  createShape() {
    const shape = this.stat.shape,
          size = this.size
    switch (shape) {
      case "circle":
        // do nothing
        break
      case "asteroid":
        // CONST how many sides the asteroid has
        this.vertices = math.asteroid(10, size)
        break
    }
  }
  
  createBody() {
    const s = this.stat,
          size = s.size,
          bodyOptions = {
            isStatic: false,
            label: this.label,
            render: style.enemy[this.type],
            collisionFilter: category.enemy,
            density: s.mass * 0.001,
            frictionAir: s.air,
          }
    let body = null
    // check for shape
    if (s.shape === "circle") {
      body = Bodies.circle(this.start.x, this.start.y, size, bodyOptions)
    } else if (s.shape === "asteroid") {
      body = Bodies.fromVertices(this.start.x, this.start.y, [this.vertices], bodyOptions)
      if (body == null) {
        console.error("Body is bad!")
        console.log(this.vertices)
        body = Bodies.circle(this.start.x, this.start.y, size, bodyOptions)        
      }
    } else {
      console.error("Invalid enemy shape: " + s.shape + "!")
      body = Bodies.circle(this.start.x, this.start.y, size, bodyOptions)
    }
    body.gametype = "enemy"
    body.enemy = this
    // launch at a certain speed
    if (s.speed !== 0) {
      const tilt = (random.randreal() - 0.5) * 15, // 15 degrees tilt max
            down = Math.PI / 180 * (90 + tilt),
            vel = Vector.mult(
              Vector.create( Math.cos(down), Math.sin(down) ),
              s.speed
            )
      body.initialVelocity = vel
      Body.setVelocity(body, vel)
      Body.setAngularVelocity(body, math.degToRad(Math.min(s.speed, 10)))
    }
    // other stats
    body.gravityScale = s.gravity
    if (s.inertia && s.inertia !== 1) {
      Body.setInertia(body, body.inertia * s.inertia)
    }
    Composite.add(Thing.world, body)
    this.body = body
  }
  
  removeBody() {
    if (!this.body) return
    Composite.remove(Thing.world, this.body)
    this.body = null
  }
  
  removeAllGuns() {
    for (let gun of this.guns) {
      gun.remove(false)
    }
    this.guns = [ ]
  }
  
  addGun(gunset, gunstat, options = { }) {
    const gun = Gun.create(this, gunset, "enemy")
    gun.setStatString(gunstat)
    this.guns.push(gun)
    return gun
  }
  
  contemplationOfMortality() {
    
  }
}
*/
