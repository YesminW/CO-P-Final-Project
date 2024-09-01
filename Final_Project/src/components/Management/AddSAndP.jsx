import React, { useState } from "react";
import { Button, FormControl } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Link, useNavigate } from "react-router-dom";
import { uploadStaffExcel } from "../../utils/apiCalls";

export default function AddsAndP() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [file, setFile] = useState("");

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    const filename = selectedFile.name;
    if (selectedFile) {
      const fileExtension = filename.split(".").pop().toLowerCase();
      if (fileExtension === "xls" || fileExtension === "xlsx") {
        setFile(selectedFile);
        setErrors((prevErrors) => ({ ...prevErrors, file: "" }));
      } else {
        setFile(null);
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: "Please upload a valid Excel file (.xls or .xlsx)",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      file && (await uploadStaffExcel(file));
      navigate("/KindergartenManagement");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="registerdiv">
        <h2 style={{ textAlign: "center", margin: 0 }}>הוספת משתמשים</h2>
      </div>

      <FormControl fullWidth margin="normal">
        <label htmlFor="profileFile">
          <input
            accept=".xls,.xlsx"
            type="file"
            id="profileFile"
            style={{ display: "none" }}
            onChange={handleChange}
          />
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
            העלאת קובץ צוות
            <CloudUploadIcon style={{ margin: "10px" }} />
          </Button>
        </label>
        {errors.file && <p>{errors.file}</p>}
      </FormControl>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <button className="btn1" onClick={handleSubmit}>
          המשך
        </button>
        <Link to="/KindergartenManagement">
          <button className="btn1">דלג</button>
        </Link>
      </div>
    </form>
  );
}
