import { Game } from "./game/game.js"
import { game_init, game_menu, game_start } from "./game/start.js"

window.addEventListener("load", function() {
    game_init()
    game_menu()
})
