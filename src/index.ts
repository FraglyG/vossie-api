import { initServer } from "./server/server";

import("./infrastructure/globals").then(initiate)

function initiate() {
    console.log("starting server")
    initServer()
}