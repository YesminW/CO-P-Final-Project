import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EfooterS from "../../Elements/EfooterS";
import "../../assets/StyleSheets/RegisterStaff.css";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { updateUserById } from "../../utils/apiCalls";

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
      console.log("err post=", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "#cce7e8",
            padding: 10,
            borderRadius: 5,
            marginBottom: 30,
          }}
        >
          <h2 style={{ textAlign: "center", margin: 0 }}>
            פרטים אישיים {details.userPrivetName}
          </h2>
        </div>
        <input
          placeholder="כתובת"
          name="UserAddress"
          className="register-input"
          variant="outlined"
          value={details.userAddress}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="מין"
          name="userGender"
          value={details.userGender}
          onChange={handleChange}
          variant="outlined"
          className="register-textfield"
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
          placeholder="בעיות בריאותיןת"
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
