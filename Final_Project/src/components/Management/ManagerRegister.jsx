import React, { useState } from "react";
import { FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ManagerRegister() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    UserPrivetName: "",
    UserSurname: "",
    UserBirthDate: "",
    UserGender: "",
    UserId: "",
  });

  const calculateAge = (UserBirthDate) => {
    const today = new Date();
    const birthDateObj = new Date(UserBirthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateForm = () => {
    const newErrors = {};
    const hebrewRegex = /^[\u0590-\u05FF\s]+$/;

    if (!formValues.UserPrivetName) {
      newErrors.UserPrivetName = "יש למלא את השם הפרטי";
    } else if (!hebrewRegex.test(formValues.UserPrivetName)) {
      newErrors.UserPrivetName = "יש למלא בשפה העברית בלבד";
    }

    if (!formValues.UserSurname) {
      newErrors.UserSurname = "יש למלא את השם משפחה";
    } else if (!hebrewRegex.test(formValues.UserSurname)) {
      newErrors.UserSurname = "יש למלא בשפה העברית בלבד";
    }

    if (!formValues.UserId) {
      newErrors.UserId = "יש למלא את תעודת זהות";
    } else if (!/^\d{9}$/.test(formValues.UserId)) {
      newErrors.UserId = "תעודת זהות חייבת להכיל 9 ספרות";
    }

    if (!formValues.UserBirthDate) {
      newErrors.UserBirthDate = "יש למלא את תאריך הלידה";
    } else if (calculateAge(formValues.UserBirthDate) < 18) {
      newErrors.UserBirthDate = "יש להיות מעל גיל 18";
    }

    if (!formValues.UserGender) {
      newErrors.UserGender = "יש לבחור את המין";
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
      navigate("/ManagerRegister2", { state: formValues });
    } else {
      console.error("Form has validation errors. Cannot submit.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="registerh2">הרשמה</h2>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>פרטים אישיים</h2>
      </div>
      <FormControl fullWidth margin="normal" style={{ width: "120%" }}>
        <input
          placeholder="שם פרטי"
          name="UserPrivetName"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserPrivetName && (
          <p className="perrors">{errors.UserPrivetName}</p>
        )}
        <br />
        <input
          placeholder="שם משפחה"
          name="UserSurname"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserSurname && <p className="perrors">{errors.UserSurname}</p>}
        <br />
        <input
          placeholder="תעודת זהות"
          name="UserId"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserId && <p className="perrors">{errors.UserId}</p>}
        <br />
        <input
          placeholder="תאריך לידה"
          name="UserBirthDate"
          type="date"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.UserBirthDate && (
          <p className="perrors">{errors.UserBirthDate}</p>
        )}
        <br />
        <select
          id="gender"
          name="UserGender"
          className="register-input"
          onChange={handleChange}
          value={formValues.UserGender}
        >
          <option value=" "> מין</option>
          <option value="male">זכר</option>
          <option value="female">נקבה</option>
          <option value="other">אחר</option>
        </select>
        {errors.UserGender && <p className="perrors">{errors.UserGender}</p>}
      </FormControl>
      <button type="submit" variant="contained">
        המשך
      </button>
    </form>
  );
}
