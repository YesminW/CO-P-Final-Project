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
import { uploadUserPhoto } from "../../utils/apiCalls";

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
    file: "",
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
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

    if (!formValues.UserBirthDate) {
      newErrors.UserBirthDate = "יש למלא את תאריך הלידה";
    } else if (calculateAge(formValues.UserBirthDate) < 18) {
      newErrors.UserBirthDate = "יש להיות מעל גיל 18";
    }

    if (!formValues.UserGender) {
      newErrors.UserGender = "יש לבחור את המין";
    }

    console.log(newErrors);

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
        <input
          placeholder="שם פרטי"
          name="UserPrivetName"
          className="register-input"
          variant="outlined"
          pattern="^[\u0590-\u05FF\s]+$"
          title="יש למלא בשפה העברית בלבד"
          required
        />
        <br />
        <input
          placeholder="שם משפחה"
          name="UserSurname"
          className="register-input"
          variant="outlined"
          pattern="^[\u0590-\u05FF\s]+$"
          title="יש למלא בשפה העברית בלבד"
          required
        />
        <br />
        <input
          placeholder="תעודת זהות"
          name="UserId"
          className="register-input"
          variant="outlined"
          pattern="\d{9}"
          maxLength="9"
          title="תעודת הזהות לא תקינה"
          required
        />
        <br />
        <input
          placeholder="תאריך לידה"
          name="UserBirthDate"
          type="date"
          className="register-input"
          variant="outlined"
          onChange={handleChange}
          required
        />
        <br />
        <select id="gender" name="UserGender" className="register-input">
          <option value="" disabled>
            מין{" "}
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
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
      <button type="submit" variant="contained">
        המשך
      </button>
    </form>
  );
}
