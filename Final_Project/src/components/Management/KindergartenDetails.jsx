import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function KindergartenDetails() {
  const { gardenName } = useParams();
  const navigate = useNavigate();
  const [sharingType, setSharingType] = useState("");
  const [assistant1, setAssistant1] = useState("");
  const [assistant2, setAssistant2] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleSharingTypeChange = (event) => {
    setSharingType(event.target.value);
  };

  const handleAssistant1Change = (event) => {
    setAssistant1(event.target.value);
  };

  const handleAssistant2Change = (event) => {
    setAssistant2(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileType = selectedFile.type;
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedTypes.includes(fileType)) {
      setFile(selectedFile);
      setFileError("");
    } else {
      setFile(null);
      setFileError("יש להעלות קובץ מסוג Excel בלבד (.xls, .xlsx)");
    }
  };

  const handleSubmit = () => {
    navigate("/KindergartenManagement");
  };

  const handleDelete = () => {
    setSharingType("");
    setAssistant1("");
    setAssistant2("");
    setFile(null);
    setFileError("");
    console.log("Form reset");
  };

  return (
    <form>
      <h2 className="registerh2">ניהול גנים</h2>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>
          {" "}
          {decodeURIComponent(gardenName)}
        </h2>
      </div>
      <FormControl fullWidth margin="normal" style={{ width: "120%" }}>
        <select
          id="gender"
          name="UserGender"
          className="register-input"
          onChange={handleSharingTypeChange}
          value={sharingType}
        >
          <option value=" "> שיוך גננת</option>
          <option value="ליאת">ליאת</option>
          <option value="אור">אור</option>
          <option value="יסמין">יסמין</option>
        </select>
        {/* {errors.UserGender && <p className="perrors">{errors.UserGender}</p>} */}
        <br />
        <div className="two-column-grid">
          <select
            id="gender"
            name="UserGender"
            className="register-input"
            onChange={handleAssistant1Change}
            value={sharingType}
          >
            <option value=" "> שיוך סייעת</option>
            <option value="ליאת">ליאת</option>
            <option value="אור">אור</option>
            <option value="יסמין">יסמין</option>
          </select>
          {/* {errors.UserGender && <p className="perrors">{errors.UserGender}</p>} */}

          <select
            id="gender"
            name="UserGender"
            className="register-input"
            onChange={handleAssistant2Change}
            value={sharingType}
          >
            <option value=" "> שיוך סייעת</option>
            <option value="ליאת">ליאת</option>
            <option value="אור">אור</option>
            <option value="יסמין">יסמין</option>
          </select>
          {/* {errors.UserGender && <p className="perrors">{errors.UserGender}</p>} */}
        </div>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <input
          accept=".xls,.xlsx"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="profileFile"
          name="file"
        />
        <label htmlFor="profileFile">
          <Button
            variant="contained"
            component="label"
            style={{ marginBottom: 20 }}
            sx={{
              fontFamily: "Karantina",
              fontSize: "20px",
              margin: "20px",
              color: "white",
              backgroundColor: "#076871",
              "&:hover": {
                backgroundColor: "#6196A6",
              },
            }}
          >
            העלאת קובץ פרטי ילדים
            {<CloudUploadIcon style={{ margin: "10px" }} />}
          </Button>
        </label>
        {file && (
          <Typography variant="body2" style={{ color: "white" }}>
            {file.name}
          </Typography>
        )}
        {fileError && (
          <Typography variant="body2" style={{ color: "red" }}>
            {fileError}
          </Typography>
        )}
      </FormControl>

      <Button
        variant="contained"
        style={{
          backgroundColor: "#B9DCD1",
          color: "white",
          fontFamily: "Karantina",
          marginTop: "20px",
          width: "100%",
          height: "60px",
          fontSize: "30px",
        }}
        onClick={handleSubmit}
      >
        שייך
      </Button>

      <Button
        variant="contained"
        style={{
          backgroundColor: "#E16162",
          fontFamily: "Karantina",
          color: "white",
          marginTop: "20px",
          width: "100%",
          height: "60px",
          fontSize: "30px",
        }}
        onClick={handleDelete}
      >
        מחק
      </Button>
    </form>
  );
}
