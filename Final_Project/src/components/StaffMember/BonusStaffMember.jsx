import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import NavigationDots from "./NavigationDots";

import "../../assets/StyleSheets/BonusStaff.css";

import EfooterS from "../../Elements/EfooterS";

export default function BonusStaffMember() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedRight: () => navigate("/ActivitiesStaffMember"),
    onSwipedLeft: () => navigate("/MainStaffMember"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="home-container flex-column space-evenly" {...handlers}>
      <header className="Bonusheader">
        <h1 style={{ fontSize: "70px" }}>בונוס</h1>
      </header>
      <div>
        <p className="bonusExplanation">
          כדי להקל עליך, חשבנו איך נוכל לחשוב במקומך, מוזמן/ת לסמן את התחומים
          שלך ולקבל המלצות לפעילויות בהתאמה
        </p>
        <div className="grid-container">
          <button className="Bonus-item">טבע</button>
          <button className="Bonus-item">אוכל</button>
          <button className="Bonus-item">ספורט</button>
          <button className="Bonus-item">מדעים</button>
          <button className="Bonus-item">מוזיקה</button>
          <button className="Bonus-item">אומנות</button>
        </div>
        <button className="add-button">הוספת תחום</button>
      </div>
      <footer className="footer">
        <Link to="/EditProfileS">
          <button className="edit-button">עריכת פרטים אישיים</button>
        </Link>
      </footer>
      <NavigationDots activeIndex={1} />
      {EfooterS}
    </div>
  );
}
