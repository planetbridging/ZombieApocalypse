var moment = require("moment");

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function dateToString(lst) {
  return lst[0] + "-" + lst[1] + "-" + lst[2];
}

function getYearMonthDay(date) {
  //console.log(date);
  var newDate = new Date();
  if (date.includes("-")) {
    var sd = date.split("-");
    var y = newDate.setFullYear(sd[0]);
    var m = newDate.setMonth(Number(sd[1]) - 1);
    var d = newDate.setDate(Number(sd[2]));
    return [y, m, d];
  }
}

function getSplitYearMonthDay(date) {
  //console.log(date);
  var newDate = new Date();
  if (date.includes("-")) {
    var sd = date.split("-");
    var y = newDate.setFullYear(sd[0]);
    var m = newDate.setMonth(Number(sd[1]) - 1);
    var d = newDate.setDate(Number(sd[2]));
    return [Number(sd[0]), Number(sd[1]), Number(sd[2])];
  }
}

function getYearMonthDayString(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + "-" + m + "-" + d;
}

function getYearMonthString(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + "-" + m;
}

function getYearMonthStringWithO(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  if (m <= 9) {
    m = "0" + m;
  }
  return y + "-" + m;
}

function getlastWeekString() {
  var d = new Date();
  d.setDate(d.getDate() - 7);
  var setLastWeek = getYearMonthDayString(d);
  return setLastWeek;
}

function convertDataToDate(date, time) {
  var newDate = new Date();
  if (date.includes("-") && time.includes(":")) {
    var sd = date.split("-");
    newDate.setFullYear(sd[0]);
    newDate.setMonth(Number(sd[1]) - 1);
    newDate.setDate(Number(sd[2]));

    var st = time.split(":");
    newDate.setHours(st[0], st[1], st[2]);

    return newDate;
  }
  return null;
}

function getTodaysDateString() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  var todayString = dd + "/" + mm + "/" + yyyy;
  return todayString;
}

function parseDate(str, div) {
  var mdy = str.split(div);
  return new Date(mdy[0], mdy[1] - 1, mdy[2]);
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

const lstOfDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStartAndEndTime(
  session_date,
  session_state_time,
  session_duration
) {
  var timestring2 = session_date + "T" + session_state_time + "Z";
  var travelTime = moment(timestring2)
    .add(session_duration, "hours")
    .format("hh:mm A");
  var startTime = moment(timestring2).format("hh:mm A");
  //console.log("---");
  //console.log(data2[l]);
  //console.log("---");
  var splitTime = travelTime.split(" ")[0].split(":");
  var splitDate = session_date.split("-");
  var splitStartTime = session_state_time.split(":");
  //console.log(splitStartTime);

  let dateStr = session_date,
    timeStr = session_state_time,
    date = moment(dateStr),
    time = moment(timeStr, "HH:mm");

  date.set({
    hour: time.get("hour"),
    minute: time.get("minute"),
    second: time.get("second"),
    moment,
  });

  let futuredateStr = session_date,
    futuretimeStr = session_state_time,
    futuredate = moment(futuredateStr),
    futuretime = moment(futuretimeStr, "HH:mm");

  futuredate.set({
    hour: futuretime.get("hour"),
    minute: futuretime.get("minute"),
    second: futuretime.get("second"),
  });

  var futureTime = futuredate.add(session_duration, "hours");
  /*console.log(
    date.hour() + ":" + date.minute(),
    futureTime.hour() + ":" + futureTime.minute()
  );*/

  var startTime = moment(date).format("hh:mm A");
  var endTime = moment(futuredate).format("hh:mm A");
  //console.log(startTime, endTime);
  return [startTime, endTime];
}

function convertApiToCalendar(data2, selectedCampus) {
  var lstData = [];
  for (var l in data2) {
    var session_date = data2[l]["session_date"];
    var session_state_time = data2[l]["session_start_time"];
    var session_duration = data2[l]["session_duration"];
    var program_tdt_full_name = data2[l]["program_tdt_full_name"];
    var timestring2 = session_date + "T" + session_state_time + "Z";
    var travelTime = moment(timestring2)
      .add(session_duration, "hours")
      .format("hh:mm A");
    //console.log("---");
    //console.log(data2[l]);
    //console.log("---");
    var splitTime = travelTime.split(" ")[0].split(":");
    var splitDate = session_date.split("-");
    var splitStartTime = session_state_time.split(":");
    //console.log(splitStartTime);

    let dateStr = session_date,
      timeStr = session_state_time,
      date = moment(dateStr),
      time = moment(timeStr, "HH:mm");

    date.set({
      hour: time.get("hour"),
      minute: time.get("minute"),
      second: time.get("second"),
    });

    let futuredateStr = session_date,
      futuretimeStr = session_state_time,
      futuredate = moment(futuredateStr),
      futuretime = moment(futuretimeStr, "HH:mm");

    futuredate.set({
      hour: futuretime.get("hour"),
      minute: futuretime.get("minute"),
      second: futuretime.get("second"),
    });

    var futureTime = futuredate.add(session_duration, "hours");
    //console.log(futureTime.hour());
    var newObj = {
      title: "yes",
      start: new Date(
        date.year(),
        date.month(),
        splitDate[2],
        date.hour(),
        date.minute()
      ),
      end: new Date(
        date.year(),
        date.month(),
        splitDate[2],
        futureTime.hour(),
        futureTime.minute()
      ),
      allDay: false,
      bgColor: "#066A00",
    };
    //console.log(data2[l]);
    if (selectedCampus == data2[l]["campus_id"] || selectedCampus == -1) {
      lstData.push(newObj);
    }

    //console.log(splitTime);
  }
  return lstData;
}

function getCurrentDateNTimeStamp() {
  const newDate = new Date().toLocaleString();
  return newDate;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

module.exports = {
  isValidDate,
  convertApiToCalendar,
  getYearMonthDayString,
  datediff,
  parseDate,
  convertDataToDate,
  getYearMonthDay,
  getMonday,
  dateToString,
  lstOfDays,
  getStartAndEndTime,
  getCurrentDateNTimeStamp,
  getTodaysDateString,
  getSplitYearMonthDay,
  getlastWeekString,
  getYearMonthString,
  getYearMonthStringWithO,
};
