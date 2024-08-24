import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import Efooterp from "../../Elements/EfooterP";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import "../../assets/StyleSheets/Register.css";
import { UploadChildPhoto } from "../../utils/apiCalls";

export default function EditProfileChild() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState("");
  const [details, setDetails] = useState(location.state);
  const formattedDate = formatDateToYMD(details.childBirthDate);

  function formatDateToYMD(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
      setFile(file);
    } else {
      alert("יש להעלות קובץ מסוג JPG או JPEG בלבד.");
    }
  };
  const handleSubmit = () => {
    if (file) {
      try {
        UploadChildPhoto({ userId: details.childId, file });
        navigate("/EditProfile");
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/EditProfile");
    }
  };

  return (
    <>
      <form>
        <div
          style={{
            backgroundColor: "#cce7e8",
            padding: 10,
            borderRadius: 5,
            marginBottom: 30,
          }}
        >
          <h2 style={{ textAlign: "center", margin: 0 }}>
            פרטים אישיים {details.childFirstName}
          </h2>
        </div>
        <input
          name="childFirstName"
          className="register-input"
          variant="outlined"
          defaultValue={details.childFirstName}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="childSurname"
          className="register-input"
          variant="outlined"
          defaultValue={details.childSurname}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="childID"
          className="register-input"
          variant="outlined"
          defaultValue={details.childId}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="UserBirthDate"
          type="date"
          className="register-input"
          variant="outlined"
          defaultValue={formattedDate}
          inputprops={{ readOnly: true }}
        />
        <br />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={0}
          sx={{
            margin: "10px",
            backgroundColor: "#076871",
            "&:hover": {
              backgroundColor: "#6196A6",
            },
            fontSize: "15px",
          }}
        >
          העלאת תמונת פרופיל
          <CloudUploadIcon style={{ margin: "10px" }} />
          <input
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={handleFileUpload}
          />
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/Allergies")}
          className="btn"
        >
          אלרגיות
        </Button>
        <Button type="submit" variant="contained" onClick={handleSubmit}>
          אישור
        </Button>
      </form>
      <Button variant="text" color="primary" onClick={() => navigate(-1)}>
        <ArrowForwardIosOutlinedIcon />
      </Button>
      {Efooterp}
    </>
  );
}
