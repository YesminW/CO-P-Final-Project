import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Efooter from "../../Elements/EfooterP";
import "../../assets/StyleSheets/EditProfileP.css";
import { getChildByParent, getUserById } from "../../utils/apiCalls";
import { CircularProgress } from "@mui/material";

export default function EditProfile() {
  const [userData, setUserData] = useState({});
  const [child, setChild] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const [childData, user] = await Promise.all([
          getChildByParent(localStorage.getItem("user_id")),
          getUserById(localStorage.getItem("user_id")),
        ]);
        setChild(childData);
        setUserData(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return loading ? (
    <CircularProgress />
  ) : (
    <div>
      <form className="bootstrap-edit-profile-container">
        <h2 className="bootstrap-edit-profile-header"> עריכת פרטים</h2>
        <Link
          to="/EditProfileChild"
          state={child}
          className="btn btn-primary bootstrap-edit-profile-button"
        >
          פרטים אישיים {child.childFirstName}
        </Link>
        <Link
          to="/EditProfileP"
          state={userData}
          className="btn btn-primary bootstrap-edit-profile-button"
        >
          פרטים אישיים {userData.UserPrivetName}
        </Link>
      </form>
      {Efooter}
    </div>
  );
}
