import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import he from "date-fns/locale/he";
import { useSwipeable } from "react-swipeable";
import NavigationDots from "./NavigationDots";

import Elogo1 from "../../Elements/Elogo1";
import EfooterS from "../../Elements/EfooterS";
import "../../assets/StyleSheets/MainStaff.css";
import { Button, CircularProgress } from "@mui/material";
import { getUserById } from "../../utils/apiCalls";

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

  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
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

  const handlers = useSwipeable({
    onSwipedRight: () => navigate("/BonusStaffMember"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return loading ? (
    <CircularProgress />
  ) : (
    <div
      className="home-container flex-column center-a space-evenly"
      {...handlers}
    >
      {Elogo1}
      <div className="info-card">
        <h2>
          {greeting} {userData.UserPrivetName}
        </h2>
      </div>
      <div className="grid-container">
        <div className="grid-item">
          <h3>
            {currentDay} <br /> {currentDate}
          </h3>
        </div>
        <Link to="/presence" className="grid-item">
          <Button
            style={{
              fontFamily: "Karantina",
              color: "white",
              fontSize: "24px",
            }}
          >
            נוכחים בגן
          </Button>
        </Link>
      </div>
      <div>
        <Link to="/ChildDuty" className="grid-item">
          <Button
            style={{
              fontFamily: "Karantina",
              color: "white",
              fontSize: "24px",
            }}
          >
            תורנים להיום
          </Button>
        </Link>
        <div>
          <Link to="/BirthDayChild" className="grid-item">
            <Button
              style={{
                fontFamily: "Karantina",
                color: "white",
                fontSize: "24px",
              }}
            >
              מי חוגג היום
            </Button>
          </Link>{" "}
        </div>
        <div className="grid-item">
          <h3>האירוע הבא היום</h3>
        </div>
      </div>
      <NavigationDots activeIndex={0} />
      {EfooterS}
    </div>
  );
}
