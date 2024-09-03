import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EfooterS from "../../Elements/EfooterS";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { updateUserById } from "../../utils/apiCalls";
import "../../assets/StyleSheets/RegisterStaff.css";

export default function EditProfileS2() {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const initialDetails = location.state || {};
  const [details, setDetails] = useState(initialDetails);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      updateUserById(details);
      navigate("/MainStaffMember");
    } catch (error) {
      console.error("err post=", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="privatediv">
          <h2 className="h2private">פרטים אישיים {details.userPrivetName}</h2>
        </div>
        <input
          placeholder="כתובת"
          name="UserAddress"
          className="register-input"
          variant="outlined"
          value={details.userAddress}
          onChange={handleChange}
        />
        <br />
        <input
          placeholder="מין"
          name="userGender"
          className="register-input"
          variant="outlined"
          defaultValue={details.userGender}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          placeholder="אימייל"
          name="UserEmail"
          className="register-input"
          variant="outlined"
          value={details.userEmail}
          onChange={handleChange}
        />
        <br />
        <input
          placeholder="בעיות בריאותיות"
          name="UserEmail"
          className="register-input"
          variant="outlined"
          value={details.healthIssues}
          onChange={handleChange}
        />
        <br />
        <div className="register-inputs flex-row">
          <input
            className="password-inputs"
            type={showPassword ? "text" : "password"}
            placeholder="סיסמא"
            name="UserpPassword"
            onChange={handleChange}
          />

          <i onClick={handleClickShowPassword}>
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </i>
        </div>
        <button type="submit" variant="contained">
          אישור
        </button>
      </form>
      {EfooterS}
    </>
  );
}
