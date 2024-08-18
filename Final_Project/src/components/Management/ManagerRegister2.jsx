import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { json, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { managerRegisterion } from "../../utils/apiCalls";

export default function AdditionalRegistrationForm(props) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    UserPhoneNumber: "",
    UserAddress: "",
    UserEmail: "",
    UserpPassword: "",
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("registrationData"));
    if (savedData) {
      setFormValues((prevData) => ({
        ...prevData,
        ...savedData,
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/; // Example: assuming phone number should be 10 digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.UserPhoneNumber) {
      newErrors.UserPhoneNumber = "יש למלא את מספר הטלפון";
    } else if (!phoneRegex.test(formValues.UserPhoneNumber)) {
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
        console.log(formValues);

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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="registerh2">הרשמה</h2>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>פרטים אישיים</h2>
      </div>
      <FormControl fullWidth margin="normal">
        <TextField
          label="מספר טלפון"
          name="UserPhoneNumber"
          value={formValues.UserPhoneNumber}
          onChange={handleChange}
          error={!!errors.UserPhoneNumber}
          helperText={errors.UserPhoneNumber}
          className="register-textfield"
          variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="כתובת"
          name="UserAddress"
          value={formValues.UserAddress}
          onChange={handleChange}
          error={!!errors.UserAddress}
          helperText={errors.UserAddress}
          className="register-textfield"
          variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="מייל"
          name="UserEmail"
          value={formValues.UserEmail}
          onChange={handleChange}
          error={!!errors.UserEmail}
          helperText={errors.UserEmail}
          className="register-textfield"
          variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="password"
          label="סיסמא"
          name="UserpPassword"
          value={formValues.UserpPassword}
          onChange={handleChange}
          className="register-textfield"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={0}
          sx={{
            fontSize: "20px",
            margin: "20px",
            fontFamily: "Karantina",
            backgroundColor: "#076871",
            "&:hover": {
              backgroundColor: "#6196A6",
            },
          }}
        >
          העלאת מסמכים
          {<CloudUploadIcon style={{ margin: "10px" }} />}
          <input
            type="file"
            name="file"
            style={{ display: "none" }}
            accept="application/pdf"
            onChange={handleChange}
          />
        </Button>
        {errors.file && <p>{errors.file}</p>}
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        המשך
      </Button>
    </form>
  );
}
