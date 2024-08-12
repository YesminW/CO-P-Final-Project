import React, { useState } from "react";
import { formatDate } from "../../utils/functions";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { nanoid } from "nanoid";
import EfooterS from "../../Elements/EfooterS";

export default function CalendarStaff() {
  const [date, setDate] = useState(new Date());
  const [activities, setActivities] = useState([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "f",
    "f",
    "f",
  ]);

  return (
    <div className="page-container page-height-with-footer flex-column gap-20">
      <div className="week-calendar-container height-50-percent padding-20 rounded-corners-25">
        <Calendar value={date} onChange={setDate} calendarType="hebrew" />
      </div>
      <div className="week-calendar-container  height-50-percent padding-h-10px rounded-corners-25">
        <h1 className="rounded-teal-container">
          לוז והתראות - {formatDate(date)}
        </h1>
        <div className="flex-column width-full height-70-percent gap-8 scroll">
          {activities.map((activity) => (
            <button
              key={nanoid()}
              className="rounded-teal-container activity-background "
              //   onClick={() => handleDayClick(day)}
            >
              <h2 className="font-30">{activity}</h2>
            </button>
          ))}
        </div>
      </div>
      {EfooterS}
    </div>
  );
}
