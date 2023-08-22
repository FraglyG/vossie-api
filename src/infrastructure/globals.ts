declare global {
    var webserviceURL: string;

    var time: {
        minute: number,
        hour: number,
        day: number,
    }
}

global.webserviceURL = "https://mylms.vossie.net/webservice/rest/server.php"

global.time = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
}

export { }