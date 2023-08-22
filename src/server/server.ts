import express from 'express'
import cors from "cors"
import { importAllFilesInFolder } from '../infrastructure/modularize'

// SETUPS
const webservices = new Map<string, Webservice>()

// CLASSES
export type WebserviceCallback = (req: any, res: any) => void
export type WebserviceType = "GET" | "POST"

export class Webservice {
    route!: string
    callback!: WebserviceCallback
    type!: WebserviceType
    description!: string

    constructor(type: WebserviceType, route: string, description: string, callback: WebserviceCallback) {
        this.type = type
        this.route = route
        this.callback = callback
        this.description = description

        // store webservice
        webservices.set(route, this)
    }

    getRoute(): string {
        return this.route
    }

    getCallback(): WebserviceCallback {
        return this.callback
    }

    setRoute(route: string): void {
        this.route = route
    }

    setCallback(callback: WebserviceCallback): void {
        this.callback = callback
    }

    execute(req: any, res: any): void {
        this.callback(req, res)
    }
}

// SERVER

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    // send route and description of all webservices
    // ROUTE - DESCRIPTION

    let response = ""
    webservices.forEach((webservice: Webservice) => {
        response += `${webservice.getRoute()} - ${webservice.description}\n`
    })

    res.status(200).send(response)
})

// FUNCTIONS

async function importWebservices() {
    // import all webservices
    const absolutePath = __dirname + "\\webservices"
    await importAllFilesInFolder(absolutePath)

    // go through all webservies and set up listeners
    webservices.forEach((webservice: Webservice) => {
        if (webservice.type == "POST") {
            app.post(webservice.getRoute(), (req, res) => {
                webservice.execute(req, res)
            })
        } else if (webservice.type == "GET") {
            app.get(webservice.getRoute(), (req, res) => {
                webservice.execute(req, res)
            })
        }
    })
}

function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

app.post("/test", (req, res) => {
    console.log(req.body)
    res.status(200).send("test")
})

// STARTUP

export async function initServer() {
    await importWebservices()
    startServer()
}