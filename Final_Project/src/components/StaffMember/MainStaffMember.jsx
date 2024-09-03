import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import he from "date-fns/locale/he";

import Elogo1 from "../../Elements/Elogo1";
import EfooterS from "../../Elements/EfooterS";
import "../../assets/StyleSheets/MainStaff.css";
import { CircularProgress } from "@mui/material";
import {
  getChildPhoto,
  getTodayBirthday,
  getTodayDuty,
  getUserById,
} from "../../utils/apiCalls";
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
  const [dutyChildren, setDutyChildren] = useState({});

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
      const image1 = await getChildPhoto(todayDuty.childId1);
      const image2 = await getChildPhoto(todayDuty.childId2);
      const url1 = URL.createObjectURL(image1);
      const url2 = URL.createObjectURL(image2);

      setDutyChildren({
        child1Name: todayDuty.child1Name,
        child2Name: todayDuty.child2Name,
        img1: url1,
        img2: url2,
      });
    }

    async function getTodayBirthdayData() {
      const todayBirthday = await getTodayBirthday(
        localStorage.getItem("kindergartenNumber"),
        formatForCSharp(today)
      );
      const birthday = [];
      for (const b of todayBirthday) {
        const image = await getChildPhoto(b.childId);
        const url = URL.createObjectURL(image);

        birthday.push({
          childFirstName: b.childFirstName,
          img: url,
        });
      }

      setCelebratingChildren(birthday);
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
          <div className="flex-row gap-20">
            <div className="flex-column">
              <img
                className="photoBirthMain"
                src={dutyChildren.img1}
                onError={(e) => (e.target.srcset = "./Images/default.png")}
              />
              <span className="spanMain">{dutyChildren.child1Name}</span>
            </div>
            <div className="flex-column">
              <img
                className="photoBirthMain"
                src={dutyChildren.img2}
                onError={(e) => (e.target.srcset = "./Images/default.png")}
              />
              <span className="spanMain">{dutyChildren.child2Name}</span>
            </div>
          </div>
        </Link>
        <Link to="/BirthDayChild" className="grid-item-full">
          מי חוגג היום
          {celebratingChildren.map((c) => (
            <div className="flex-column" key={c.childFirstName}>
              <img
                className="photoBirthMain"
                src={c.img}
                onError={(e) => (e.target.srcset = "./Images/default.png")}
              />
              <span className="spanMain">{c.childFirstName}</span>
            </div>
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
