import React, { useState } from "react";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { addKindergarten } from "../../utils/apiCalls";

export default function AddKindergarden() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    KindergartenName: "",
    KindergartenAddress: "",
  });

  const validateForm = () => {
    const newErrors = {};
    const hebrewRegex = /^[\u0590-\u05FF\s]+$/;

    if (!hebrewRegex.test(formValues.KindergartenName)) {
      newErrors.KindergartenName = "יש למלא בשפה העברית בלבד";
    }

    if (!hebrewRegex.test(formValues.KindergartenAddress)) {
      newErrors.KindergartenAddress = "יש למלא בשפה העברית בלבד";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm) {
      try {
        await addKindergarten(
          formValues.KindergartenName,
          formValues.KindergartenAddress
        );
        navigate("/KindergartenManagement");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="registerh2">הרשמה</h2>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>הקמת גן</h2>
      </div>

      <FormControl fullWidth margin="normal">
        <input
          placeholder="שם הגן"
          name="KindergartenName"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.KindergartenName && (
          <p className="perrors">{errors.KindergartenName}</p>
        )}
        <br />
        <input
          placeholder="כתובת"
          name="KindergartenAddress"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
        />
        {errors.KindergartenAddress && (
          <p className="perrors">{errors.KindergartenAddress}</p>
        )}
      </FormControl>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <button className="btn1">המשך</button>
        <Link to="/KindergartenManagement">
          <button className="btn1">חזור</button>
        </Link>
      </div>
    </form>
  );
}
