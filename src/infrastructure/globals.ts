declare global {
    var webserviceURL: string;

    var time: {
        minute: number,
        hour: number,
        day: number,
    }
}

global.webserviceURL = "https://mylms.vossie.net/webservice/rest/server.php"

export { }