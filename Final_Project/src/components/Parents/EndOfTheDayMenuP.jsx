import { Link } from "react-router-dom";
import "../../assets/StyleSheets/EndOfTheDayMenu.css";
import { useState } from "react";
import { uploaspictures } from "../../utils/apiCalls";
import EfooterP from "../../Elements/EfooterP";

export default function EndOfTheDayMenuP() {
  return (
    <div className="menudiv flex-column center">
      <Link className="menulink" to="/EndOfTheDay">
        מה היה לנו היום?
      </Link>
      <Link className="menulink">צפייה בתמונות</Link>

      {EfooterP}
    </div>
  );
}
