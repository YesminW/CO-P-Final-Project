import React, { useState } from "react";
import { Button, FormControl } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { managerRegisterion } from "../../utils/apiCalls";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function AdditionalRegistrationForm(props) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    UserPhoneNumber: "",
    UserAddress: "",
    UserEmail: "",
    UserpPassword: "",
    KindergartenName: "",
    ...data,
  });

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.UserPhoneNumber) {
      newErrors.UserPhoneNumber = "יש למלא את מספר הטלפון";
    } else if (!/^\d{10}$/.test(formValues.UserPhoneNumber)) {
      newErrors.UserPhoneNumber = "מספר טלפון לא תקין";
    }

    if (!formValues.UserAddress) {
      newErrors.UserAddress = "יש למלא את הכתובת";
    }

    if (!formValues.UserEmail) {
      newErrors.UserEmail = "יש למלא את האימייל";
    } else if (!emailRegex.test(formValues.UserEmail)) {
      newErrors.UserEmail = "אימייל לא תקין";
    }

    if (!formValues.UserpPassword) {
      newErrors.UserpPassword = "יש למלא את הסיסמא";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormValues((prevData) => ({
      ...prevData,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const data = await managerRegisterion(formValues);
        navigate("/LoginManage");
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Form has validation errors. Cannot submit.");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="registerh2">הרשמה</h2>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>פרטים אישיים</h2>
      </div>
      <FormControl fullWidth margin="normal" style={{ width: "120%" }}>
        <input
          placeholder="מספר טלפון"
          name="UserPhoneNumber"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserPhoneNumber && <p>{errors.UserPhoneNumber}</p>}
        <br />
        <input
          placeholder="כתובת"
          name="UserAddress"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserAddress && <p>{errors.UserAddress}</p>}
        <br />
        <input
          placeholder="אימייל"
          name="UserEmail"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserEmail && <p>{errors.UserEmail}</p>}
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
        <br />
        <div className="register-inputs flex-row">
          <input
            className="password-inputs"
            type={showPassword ? "text" : "password"}
            placeholder="אימות סיסמא"
            name="password"
            onChange={(e) => {
              if (e.target.value !== formValues.UserpPassword) {
                console.log("Not matching");
              }
            }}
          />
          <i onClick={handleClickShowPassword}>
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </i>
        </div>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        המשך
      </Button>
    </form>
  );
}
