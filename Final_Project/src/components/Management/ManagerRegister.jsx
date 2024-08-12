import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ManagerRegister() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [formValues, setFormValues] = useState({
    UserPrivetName: "",
    UserSurname: "",
    UserBirthDate: "",
    UserGender: "",
    UserId: "",
    file:""
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
      console.log("Uploaded file:", file);
      setFile(file);
    } else {
      alert("יש להעלות קובץ מסוג JPG או JPEG בלבד.");
    }
  };

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
      newErrors.UserPrivetName = "יש למלא את שם פרטי";
    } else if (!hebrewRegex.test(formValues.UserPrivetName)) {
      newErrors.UserPrivetName = "יש למלא בשפה העברית בלבד";
    }

    if (!formValues.UserSurname) {
      newErrors.UserSurname = "יש למלא את שם משפחה";
    } else if (!hebrewRegex.test(formValues.UserSurname)) {
      newErrors.UserSurname = "יש למלא בשפה העברית בלבד";
    }

    if (!formValues.UserBirthDate) {
      newErrors.UserBirthDate = "יש למלא את תאריך הלידה";
    } else if (calculateAge(formValues.UserBirthDate) < 18) {
      newErrors.UserBirthDate = "יש להיות מעל גיל 18";
    }

    if (!formValues.UserGender) {
      newErrors.UserGender = "יש לבחור את המין";
    }

    if (!formValues.UserId) {
      newErrors.UserId = "יש להוסיף תעודת זהות";
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
      console.log("Form has validation errors. Cannot submit.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="registerh2">הרשמה</h2>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>פרטים אישיים</h2>
      </div>
      <FormControl fullWidth margin="normal" style={{ width: "120%" }}>
        <TextField
          label="שם פרטי"
          name="UserPrivetName"
          value={formValues.UserPrivetName}
          onChange={handleChange}
          error={!!errors.UserPrivetName}
          helperText={errors.UserPrivetName}
          className="register-textfield"
          variant="outlined"
          required
        />
        <br />
        <TextField
          label="שם משפחה"
          name="UserSurname"
          value={formValues.UserSurname}
          onChange={handleChange}
          error={!!errors.UserSurname}
          helperText={errors.UserSurname}
          className="register-textfield"
          variant="outlined"
          required
        />
        <br />
        <TextField
          label="תעודת זהות"
          name="UserId"
          value={formValues.UserId}
          onChange={handleChange}
          error={!!errors.UserId}
          helperText={errors.UserId}
          className="register-textfield"
          variant="outlined"
          required
        />
        <br />
        <TextField
          name="UserBirthDate"
          type="date"
          value={formValues.UserBirthDate}
          onChange={handleChange}
          error={!!errors.UserBirthDate}
          helperText={errors.UserBirthDate}
          InputLabelProps={{ shrink: true }}
          className="register-textfield"
          variant="outlined"
          required
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={0}
          sx={{
            fontFamily: "Karantina",
            fontSize: "20px",
            margin: "20px",
            backgroundColor: "#076871",
            "&:hover": {
              backgroundColor: "#6196A6",
            },
          }}
        >
          העלאת תמונת פרופיל
          {<CloudUploadIcon style={{ margin: "10px" }} />}
          <input
            type="file"
            name="file"
            style={{ display: "none" }}
            accept="image/jpg, image/jpeg"
            onChange={handleFileUpload}
          />
        </Button>
        {errors.profilePicture && <p>{errors.profilePicture}</p>}
      </FormControl>
      <FormControl
        fullWidth
        margin="normal"
        style={{ width: "120%", direction: "rtl", padding: "10px 0" }}
      >
        <InputLabel style={{ fontFamily: "Karantina", fontSize: "20px" }}>
          מין
        </InputLabel>
        <Select
          style={{ direction: "rtl", backgroundColor: "#B9DCD1" }}
          labelId="gender-label"
          name="UserGender"
          value={formValues.UserGender}
          onChange={handleChange}
          error={!!errors.UserGender}
          className="register-textfield"
          required
        >
          <MenuItem value="male">זכר</MenuItem>
          <MenuItem value="female">נקבה</MenuItem>
          <MenuItem value="other">אחר</MenuItem>
        </Select>
        {errors.UserGender && <p>{errors.UserGender}</p>}
      </FormControl>
      <Button type="submit" variant="contained">
        המשך
      </Button>
    </form>
  );
}
