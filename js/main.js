import { game_init, game_menu } from "./game/start.js"

import { tools } from "./util/tools.js"

window.addEventListener("load", function() {
    tools.checkMobile()
    game_init()
    game_menu()
})
