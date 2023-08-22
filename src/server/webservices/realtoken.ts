import axios from "axios";
import { Webservice, WebserviceCallback } from "../server";

const webserviceFunction: WebserviceCallback = async (req, res) => {
    // get the 'token' query
    const token = req.query.token

    if (!token) {
        res.status(200).send(false)
        return
    }

    // get calendar
    const params = new URLSearchParams({
        wstoken: token,
        wsfunction: 'core_calendar_get_calendar_monthly_view',
        moodlewsrestformat: 'json',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        courseid: 0, // Replace with the desired course ID (0 for all courses)
    } as any);

    const response = await axios.get(webserviceURL, { params })

    if (response.data.weeks) {
        res.status(200).send(true)
    } else {
        res.status(200).send(false)
    }
}

const webservice = new Webservice("GET", "/realtoken", "Checks if token is real", webserviceFunction)