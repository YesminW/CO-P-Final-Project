import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Typography, FormControl } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  getAllAssistants,
  getAllTeacher,
  uploadParentsExcel,
} from "../../utils/apiCalls";

export default function KindergartenDetails() {
  const navigate = useNavigate();
  const [Teachers, setTeachers] = useState("");
  const [assistant1, setAssistant1] = useState("");
  const [assistant2, setAssistant2] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const location = useLocation();
  const [kindergarten, setkindergarten] = useState(location.state);

  useEffect(() => {
    try {
      async function getTeachers() {
        try {
          const Teacher = await getAllTeacher();
          setTeachers(Teacher);
        } catch (error) {
          console.error(error);
        }
      }
      getTeachers();
    } catch (error) {}
    try {
      async function getAssistants() {
        try {
          const Assistants = await getAllAssistants();
          setTeachers(Assistants);
        } catch (error) {
          console.error(error);
        }
      }
      getAssistants();
    } catch (error) {}
  }, []);

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

  const handleSubmit = async (a) => {
    try {
      await uploadParentsExcel(file, kindergarten.kindergartenNumber);
      navigate("/KindergartenManagement");
    } catch (error) {}
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
          {decodeURIComponent(kindergarten.kindergartenName)}
        </h2>
      </div>
      <FormControl fullWidth margin="normal" style={{ width: "120%" }}>
        <select id="gender" name="UserGender" className="register-input">
          <option value=" "> שיוך גננת</option>
          <option value="ליאת">ליאת</option>
          <option value="אור">אור</option>
          <option value="יסמין">יסמין</option>
        </select>
        <br />
        <div className="two-column-grid">
          <select
            id="gender"
            name="UserGender"
            className="register-input"
            onChange={handleAssistant1Change}
          >
            <option value=" "> שיוך סייעת</option>
            <option value="ליאת">ליאת</option>
            <option value="אור">אור</option>
            <option value="יסמין">יסמין</option>
          </select>

          <select
            id="gender"
            name="UserGender"
            className="register-input"
            onChange={handleAssistant2Change}
          >
            <option value=" "> שיוך סייעת</option>
            <option value="ליאת">ליאת</option>
            <option value="אור">אור</option>
            <option value="יסמין">יסמין</option>
          </select>
        </div>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <input
          accept=".xls,.xlsx"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="profileFile"
        />
        <label htmlFor="profileFile">
          <Button
            variant="contained"
            component="span"
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
            העלאת קובץ פרטי הורים
            {<CloudUploadIcon style={{ margin: "10px" }} />}
          </Button>
        </label>
        {/* <input
          accept=".xls,.xlsx"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="profileFile"
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
        </label> */}
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
