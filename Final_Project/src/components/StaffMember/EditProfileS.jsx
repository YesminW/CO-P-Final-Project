import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EfooterS from "../../Elements/EfooterS";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import "../../assets/StyleSheets/RegisterStaff.css";
import { getUserById, uploadUserPhoto } from "../../utils/apiCalls";

export default function EditProfileS() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const formattedDate = formatDateToYMD(userData.userBirthDate);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const user = await getUserById(localStorage.getItem("user_id"));
        setUserData(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  function formatDateToYMD(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function handlePhoneNumberChange(e) {
    const { value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      userPhoneNumber: value,
    }));
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
        uploadUserPhoto({ userId: userData.userId, file });
        navigate("/EditProfileS2", { state: userData });
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/EditProfileS2", { state: userData });
    }
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <form onSubmit={handleSubmit}>
        <div className="privatediv">
          <h2 className="h2private">פרטים אישיים {userData.userPrivetName}</h2>
        </div>
        <input
          name="UserPrivetName"
          className="register-input"
          variant="outlined"
          defaultValue={userData.userPrivetName}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="UserSurname"
          className="register-input"
          variant="outlined"
          defaultValue={userData.userSurname}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="userId"
          className="register-input"
          variant="outlined"
          defaultValue={userData.userId}
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
        <input
          name="userPhoneNumber"
          type="numbers"
          className="register-input"
          variant="outlined"
          value={userData.userPhoneNumber}
          onChange={handlePhoneNumberChange}
        />
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
        <button type="submit" variant="contained">
          המשך
        </button>
      </form>
      {EfooterS}
    </>
  );
}
