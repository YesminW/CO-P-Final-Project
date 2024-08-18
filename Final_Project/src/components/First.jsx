import React from "react";
import { Link } from "react-router-dom";
import Elogo from "../Elements/Elogo";

import "../assets/StyleSheets/Main.css";

export default function First() {
  return (
    <div>
      {Elogo}
      <br />
      <h1 className="loginh1">מי אתה/את?</h1>
      <div className="login-buttons">
        <Link to="/LoginParent" className="btn">
          הורה
        </Link>
        <Link to="/LoginStaffMember" className="btn">
          איש צוות
        </Link>
      </div>
      <Link to="/LoginManage">
        <button className="btn">מנהל/ת חינוך</button>
      </Link>
    </div>
  );
}
