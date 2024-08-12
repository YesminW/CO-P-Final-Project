import { useState, useEffect } from "react";
import EfooterS from "../../Elements/EfooterS";
import {
    formatDate,
    getCurrentWeekDates,
    getWeekDates,
    getWeeksInSchoolYear,
} from "../../utils/functions";
import "./WeekCalendar.css";
import { nanoid } from "nanoid";
import { hebrewWeekDays } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

export default function WeekCalendar() {
    const weeks = getWeeksInSchoolYear();
    const [selectedWeek, setSelectedWeek] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const currentWeekDates = getCurrentWeekDates();
        const start = currentWeekDates[0];
        const end = currentWeekDates[currentWeekDates.length - 1];
        const week = weeks.findIndex(
            (w) =>
                w.start.getTime() === start.getTime() &&
                w.end.getTime() === end.getTime()
        );
        setSelectedWeek(week);
    }, []);

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    const handleDayClick = (date) => {
        navigate("/WatchDayHourList", { state: date });
    };

    return (
        <div className="flex-column page-container week-calendar-container space-between">
            <div>
                <h1 className="rounded-teal-container padding-v-40 flex-column gap-20">
                    לוז שבועי
                </h1>
                <select
                    className="date-drop-down"
                    onChange={handleWeekChange}
                    value={selectedWeek}
                >
                    {weeks.map((week, index) => (
                        <option key={nanoid()} value={index}>
                            {formatDate(week.start)} - {formatDate(week.end)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-length flex-column center">
                <div className="two-column-grid gap-20">
                    {getWeekDates(weeks[selectedWeek].start).map(
                        (day, index) => (
                            <button
                                key={nanoid()}
                                className="rounded-teal-container flex-column center"
                                onClick={() => handleDayClick(day)}
                            >
                                <h2 className="font-40">
                                    {hebrewWeekDays[index]}
                                </h2>
                                <p className="font-30">{formatDate(day)}</p>
                            </button>
                        )
                    )}
                </div>
            </div>
            {EfooterS}
        </div>
    );
}
