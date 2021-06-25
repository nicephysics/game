import { config, category } from "../config/config.js"

import { Thing } from "./thing.js"
import { things } from "./things.js"

export class Controller {
  // static
  
  // fields
  type = "none"
  
  // constructor
  constructor(thing) {
    this.thing = thing
  }
  
  // get
  get ctrl() {
    return this.thing.control
  }
  
  // set
  
  // go!
  tick() {
    switch (this.type) {
      case "player":
        this.tickPlayer()
        break
      case "enemy":
        this.tickEnemy()
        break
      case "none":
        // do nothing!
        break
      default:
        console.error("Unknown controller type: ", this.type)
        break
    }
  }
  
  tickPlayer() {
    // todo
  }
  
  tickEnemy() {
    // todo
  }
}
