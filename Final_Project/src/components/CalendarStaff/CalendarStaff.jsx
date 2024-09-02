import React, { useEffect, useState } from "react";
import {
  formatDate,
  formatDateForUs,
  formatForCSharp,
} from "../../utils/functions";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EfooterS from "../../Elements/EfooterS";
import { getAllActivitiesByDate } from "../../utils/apiCalls";
import { nanoid } from "nanoid";
import "../CalendarStaff/CalendarStaff.css";

export default function CalendarStaff() {
  const [date, setDate] = useState(new Date());
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function getactivitiesData() {
      const data = await getAllActivitiesByDate(
        kindergartenNumber,
        formatForCSharp(date)
      );

      const sortedActivities = data.sort(
        (a, b) => new Date(a.activityDate) - new Date(b.activityDate)
      );
      setActivities(sortedActivities);
    }

    getactivitiesData();
  }, [date, kindergartenNumber]);

  console.log(activities);

  return (
    <div className="page-container page-height-with-footer flex-column gap-20">
      <div className="week-calendar-container height-50-percent padding-20 rounded-corners-25">
        <Calendar value={date} onChange={setDate} calendarType="hebrew" />
      </div>
      <div className="week-calendar-container height-50-percent padding-h-10px rounded-corners-25">
        <h1 className="rounded-teal-container">
          לוז והתראות - {formatDate(date)}
        </h1>
        <div className="flex-column width-full height-70-percent gap-8 scroll">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <button
                key={nanoid()}
                className="rounded-teal-container activity-background"
              >
                <h2 className="font-30">{activity.activityName}</h2>
                <p>{activity.activityHour}</p>
              </button>
            ))
          ) : (
            <p className="calenderP">אין פעילויות היום</p>
          )}
        </div>
      </div>
      {EfooterS}
    </div>
  );
}
