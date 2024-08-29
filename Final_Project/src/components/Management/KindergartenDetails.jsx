import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Typography, FormControl } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  addChildrenByExcel,
  assignStaffToKindergarten,
  getAllAssistants,
  getAllTeacher,
  uploadParentsExcel,
} from "../../utils/apiCalls";

export default function KindergartenDetails() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [assistant1, setAssistant1] = useState({});
  const [assistant2, setAssistant2] = useState({});
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileError, setFileError] = useState("");
  const [file2Error, setFile2Error] = useState("");
  const location = useLocation();
  const [kindergarten, setkindergarten] = useState(location.state);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function getData() {
      try {
        const [teacher, assistants] = await Promise.all([
          getAllTeacher(),
          getAllAssistants(),
        ]);
        setTeachers(teacher);
        setAssistants(assistants);
      } catch (error) {
        console.error(error);
      }
    }

    getData();
  }, []);

  const handleTeacher = (event) => {
    setTeacher(JSON.parse(event.target.value));
  };

  const handleAssistant1Change = (event) => {
    setAssistant1(JSON.parse(event.target.value));
  };

  const handleAssistant2Change = (event) => {
    setAssistant2(JSON.parse(event.target.value));
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
  const handleFile2Change = (event) => {
    const selectedFile = event.target.files[0];
    const fileType = selectedFile.type;
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedTypes.includes(fileType)) {
      setFile2(selectedFile);
      setFile2Error("");
    } else {
      setFile2(null);
      setFile2Error("יש להעלות קובץ מסוג Excel בלבד (.xls, .xlsx)");
    }
  };

  const handleSubmit = async (a) => {
    try {
      teacher &&
        (await assignStaffToKindergarten(
          kindergarten.kindergartenNumber,
          currentYear,
          teacher.userPrivetName,
          teacher.userSurname
        ));
      assistant1 &&
        (await assignStaffToKindergarten(
          kindergarten.kindergartenNumber,
          currentYear,
          assistant1.userPrivetName,
          assistant1.userSurname
        ));
      assistant2 &&
        (await assignStaffToKindergarten(
          kindergarten.kindergartenNumber,
          currentYear,
          assistant2.userPrivetName,
          assistant2.userSurname
        ));
      file &&
        (await uploadParentsExcel(
          file,
          kindergarten.kindergartenNumber,
          currentYear
        ));
      file2 && (await addChildrenByExcel(file2));
      navigate("/KindergartenManagement");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    setSharingType("");
    setAssistant1("");
    setAssistant2("");
    setFile(null);
    setFileError("");
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
        <select
          id="gender"
          name="UserGender"
          className="register-input"
          onChange={handleTeacher}
        >
          <option value={JSON.stringify({})}> שיוך גננת</option>
          {teachers.map((t) => (
            <option value={JSON.stringify(t)} key={t.userPrivetName}>
              {t.userPrivetName} {t.userSurname}
            </option>
          ))}
        </select>
        <br />
        <div className="two-column-grid">
          <select
            id="gender"
            name="UserGender"
            className="register-input"
            onChange={handleAssistant1Change}
          >
            <option value={JSON.stringify({})}> שיוך סייעת</option>
            {assistants
              .filter(
                (a) =>
                  !Object.keys(a).every((key) => a[key] === assistant2[key])
              )
              .map((a) => (
                <option value={JSON.stringify(a)} key={a.userPrivetName}>
                  {a.userPrivetName} {a.userSurname}
                </option>
              ))}
          </select>

          <select
            id="gender"
            name="UserGender"
            className="register-input"
            onChange={handleAssistant2Change}
          >
            <option value={JSON.stringify({})}> שיוך סייעת</option>
            {assistants
              .filter(
                (a) =>
                  !Object.keys(a).every((key) => a[key] === assistant1[key])
              )
              .map((a) => (
                <option value={JSON.stringify(a)} key={a.userPrivetName}>
                  {a.userPrivetName} {a.userSurname}
                </option>
              ))}
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
        </label>
        <input
          accept=".xls,.xlsx"
          type="file"
          onChange={handleFile2Change}
          style={{ display: "none" }}
          id="profileFile2"
        />
        <label htmlFor="profileFile2">
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
            העלאת קובץ פרטי ילדים
            {<CloudUploadIcon style={{ margin: "10px" }} />}
          </Button>
          {file2 && (
            <Typography variant="body2" style={{ color: "white" }}>
              {file2.name}
            </Typography>
          )}
          {file2Error && (
            <Typography variant="body2" style={{ color: "red" }}>
              {file2Error}
            </Typography>
          )}
        </label>
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
