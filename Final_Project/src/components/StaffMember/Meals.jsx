import React, { useState, useEffect } from "react";
import EfooterS from "../../Elements/EfooterS";
import "../../assets/StyleSheets/Meals.css";
import { useNavigate } from "react-router-dom";
import {
  formatDate,
  getCurrentWeekDates,
  getWeekDates,
  getWeeksInSchoolYear,
} from "../../utils/functions";
import { hebrewWeekDays } from "../../utils/constants";
import { nanoid } from "nanoid";

export default function Meals() {
  const navigate = useNavigate();

  const weeks = getWeeksInSchoolYear();
  const [selectedWeek, setSelectedWeek] = useState(0);

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
    navigate("/WatchMeal", { state: date });
  };

  const handleAddMealClick = () => {
    navigate("/AddMeal");
  };

  return (
    <div className="container flex-column center">
      <header className="headermeals">מה אוכלים היום</header>
      <div className="date-selector">
        <select onChange={handleWeekChange} value={selectedWeek}>
          {weeks.map((week, index) => (
            <option key={nanoid()} value={index}>
              {formatDate(week.start)} - {formatDate(week.end)}
            </option>
          ))}
        </select>
      </div>
      <div className="sizem">
        <div className="day-grid">
          {getWeekDates(weeks[selectedWeek].start).map((day, index) => (
            <button
              key={nanoid()}
              className="day-button"
              onClick={() => handleDayClick(day)}
            >
              {hebrewWeekDays[index]} <br /> {formatDate(day)}
            </button>
          ))}
        </div>
      </div>
      {EfooterS}
    </div>
  );
}
