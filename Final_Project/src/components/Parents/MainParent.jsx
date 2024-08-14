import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import he from "date-fns/locale/he";

import Elogo1 from "../../Elements/Elogo1";
import Efooter from "../../Elements/EfooterP";
import "../../assets/StyleSheets/MainStaff.css";
import { CircularProgress } from "@mui/material";
import { getUserById } from "../../utils/apiCalls";

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
    <div className="centered-text">
      {Elogo1}
      <br />
      <div className="info-card">
        <h2>
          {greeting} {userData.userPrivetName}
        </h2>
      </div>
      <div className="grid-container">
        <div className="grid-item">
          <h3>
            {currentDay} <br /> {currentDate}
          </h3>
        </div>
        <Link to={"/chatlist"}>
          <div className="grid-item">
            <h3>שליחת הודעה לגננת</h3>
          </div>
        </Link>
      </div>
      <div>
        <div className="grid-item">
          <h3>האירוע הבא ביום</h3>
        </div>
        <div className="grid-item">
          <h3>מה אוכלים היום?</h3>
        </div>
        <div className="grid-item">
          <Link to="/EditProfile">
            <h3>עריכת פרטים</h3>
          </Link>
        </div>
      </div>
      {Efooter}
    </div>
  );
}
