import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import he from "date-fns/locale/he";

import Efooter from "../../Elements/EfooterP";
import "../../assets/StyleSheets/MainStaff.css";
import { CircularProgress } from "@mui/material";
import { getUserById } from "../../utils/apiCalls";
import Elogo1 from "../../Elements/Elogo1";

export default function MainParent() {
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

  useEffect(() => {
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
    getUserData();

    const today = new Date();
    setCurrentDay(format(today, "EEEE", { locale: he }));
    setCurrentDate(format(today, "dd/MM/yyyy"));
  }, []);

  return loading ? (
    <CircularProgress />
  ) : (
    <div className="home-container flex-column center">
      <div className="logOutdiv">
        <Link className="logOut" to="/">
          התנתק
        </Link>
      </div>
      {Elogo1}
      <br />
      <div className="info-card">
        <h2 className="h2main">
          {greeting} {userData.userPrivetName}
        </h2>
      </div>
      <div className="grid-container flex-row">
        <Link to="/CalendarStaff" className="grid-item">
          {currentDay} <br /> {currentDate}
        </Link>
        <Link to="/chatlist" className="grid-item h3main">
          שליחת הודעה לגננת
        </Link>
      </div>
      <div className="flex-column">
        <Link to="/CalendarStaff" className="grid-item-full">
          האירוע הבא ביום
        </Link>
        <Link to="/WatchMealP" className="grid-item-full" state={new Date()}>
          מה אוכלים היום?
        </Link>
        <Link to="/EditProfile" className="grid-item-full">
          עריכת פרטים אישיים
        </Link>
      </div>
      {Efooter}
    </div>
  );
}
