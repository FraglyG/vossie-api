import axios from "axios";
import { Webservice, WebserviceCallback } from "../server";

// axios.get(siteUrl, { params })
//     .then(response => {
//         if (response.data) {
//             console.log('Calendar events:', response.data.weeks);
//             console.log(response.data.weeks[0].days[5])
//             // Handle the calendar events data here
//         } else {
//             console.log('No data received.');
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching calendar:', error);
//     });

interface Day {
    seconds: number;
    minutes: number;
    hours: number;
    mday: number;
    wday: number;
    year: number;
    yday: number;
    istoday: boolean;
    isweekend: boolean;
    timestamp: number;
    neweventtimestamp: number;
    viewdaylink: string;
    events: Event[];
    hasevents: boolean;
    calendareventtypes: any[]; // You can replace 'any' with a more specific type if you have it
    previousperiod: number;
    nextperiod: number;
    navigation: string;
    haslastdayofevent: boolean;
    popovertitle: string;
    daytitle: string;
}

interface Event {
    id: number;
    name: string;
    description: string;
    descriptionformat: number;
    location: string;
    categoryid: number | null;
    groupid: number | null;
    userid: number;
    repeatid: number | null;
    eventcount: number | null;
    component: string;
    modulename: string;
    activityname: string;
    activitystr: string;
    instance: number;
    eventtype: string;
    timestart: number;
    timeduration: number;
    timesort: number;
    timeusermidnight: number;
    visible: number;
    timemodified: number;
    overdue: boolean;
    icon: {
        key: string;
        component: string;
        alttext: string;
    };
    course: {
        id: number;
        fullname: string;
        shortname: string;
        idnumber: string;
        summary: string;
        summaryformat: number;
        startdate: number;
        enddate: number;
        visible: boolean;
        showactivitydates: boolean;
        showcompletionconditions: boolean;
        fullnamedisplay: string;
        viewurl: string;
        courseimage: string;
        progress: number;
        hasprogress: boolean;
        isfavourite: boolean;
        hidden: boolean;
        showshortname: boolean;
        coursecategory: string;
    };
    subscription: {
        displayeventsource: boolean;
    };
    canedit: boolean;
    candelete: boolean;
    deleteurl: string;
    editurl: string;
    viewurl: string;
    formattedtime: string;
    isactionevent: boolean;
    iscourseevent: boolean;
    iscategoryevent: boolean;
    groupname: string | null;
    normalisedeventtype: string;
    normalisedeventtypetext: string;
    purpose: string;
    url: string;
    islastday: boolean;
    popupname: string;
    mindaytimestamp: number;
    mindayerror: string;
    draggable: boolean;
}

interface Week {
    days: Day[];
}

const webserviceFunction: WebserviceCallback = async (req, res) => {
    // get the 'token' query
    const token = req.query.token

    if (!token) {
        res.status(404).send("No Token")
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

    const dayArray = new Array<Day>()

    const response = await axios.get(webserviceURL, { params })
    const weeks = response.data.weeks as Week[]

    if (!weeks) {
        res.status(404).send("Invalid Token")
        return
    }

    // collect all the days of the weeks
    for (const week of weeks) {
        for (const day of week.days) {
            dayArray.push(day)
        }
    }

    res.status(200).send(dayArray)
}

const webservice = new Webservice("GET", "/calendar", "Get calendar", webserviceFunction)