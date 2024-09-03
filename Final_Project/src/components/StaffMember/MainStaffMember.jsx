import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import he from "date-fns/locale/he";

import Elogo1 from "../../Elements/Elogo1";
import EfooterS from "../../Elements/EfooterS";
import "../../assets/StyleSheets/MainStaff.css";
import { CircularProgress } from "@mui/material";
import { getTodayBirthday, getTodayDuty, getUserById } from "../../utils/apiCalls";
import { formatForCSharp } from "../../utils/functions";

export default function MainStaffMember() {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "בוקר טוב";
    } else if (currentHour < 18) {
      return "צהריים טובים";
    } else {
      return "ערב טוב";
    }
  };

  const [userData, setUserData] = useState(null);
  let greeting = getGreeting();
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [celebratingChildren, setCelebratingChildren] = useState([]);

  useEffect(() => {
    const today = new Date();

    async function getUserData() {
      try {
        setLoading(true);
        const user = await getUserById(localStorage.getItem("user_id"));
        setUserData(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    async function getTodayDutyData() {
      const todayDuty = await getTodayDuty(
        localStorage.getItem("kindergartenNumber"),
        formatForCSharp(today)
      );
    }

    async function getTodayBirthdayData() {
      const todayBirthday = await getTodayBirthday(
        localStorage.getItem("kindergartenNumber"),
        formatForCSharp(today)
      );
      setCelebratingChildren(todayBirthday.map((t) => t.childFirstName));
    }

    getUserData();
    getTodayBirthdayData();
    getTodayDutyData();
    setCurrentDay(format(today, "EEEE", { locale: he }));
    setCurrentDate(format(today, "dd/MM/yyyy"));
  }, []);

  return loading ? (
    <CircularProgress />
  ) : (
    <div className="home-container flex-column center">
      {Elogo1}
      <div className="info-card">
        <h2 className="h2main">
          {greeting} {userData.userPrivetName}
        </h2>
      </div>
      <div className="grid-container flex-row">
        <Link to="/CalendarStaff" className="grid-item">
          {currentDay} <br /> {currentDate}
        </Link>
        <Link to="/presence" className="grid-item h3main">
          נוכחים בגן
        </Link>
      </div>
      <div className="flex-column">
        <Link to="/ChildDuty" className="grid-item-full">
          תורנים להיום
        </Link>
        <Link to="/BirthDayChild" className="grid-item-full">
          מי חוגג היום
          {celebratingChildren.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </Link>
        <Link to="/EditProfileS" className="grid-item-full">
          עריכת פרטים אישיים
        </Link>
      </div>
      {EfooterS}
    </div>
  );
}
