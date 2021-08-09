import { save } from "../game/save.js"

export const VERSION = "0.0.5"
export const saveversion = 1405

export const versions = {
  "0.0.0": {
    name: "Nothing!",
    date: "1-1-2020",
    text: ["Nothing!", ],
  },
  "0.0.1": {
    name: "Create I.",
    date: "7-6-2021",
    text: ["Started creating the game.", ],
  },
  "0.0.2": {
    name: "Create II.",
    date: "11-6-2021",
    text: ["The game is playable now!", ],
  },
  "0.0.3": {
    name: "Refactor",
    date: "18-6-2021",
    text: ["Re-structuring the entire code...", ],
  },
  "0.0.4": {
    name: "",
    date: "25-7-2021",
    text: ["Making stars and planets (#1)", ],
  },
  "0.0.5": {
    name: "Saves",
    date: "9-8-2021",
    text: ["Working on the save feature (#4)", ],
  }
}
