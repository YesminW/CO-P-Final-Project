import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EfooterS from "../../Elements/EfooterS";

import "../../assets/StyleSheets/RegisterStaff.css";
import { getUserById } from "../../utils/apiCalls";

export default function EditProfileS() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        setUserData(getUserById(localStorage.getItem("user_id")));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handlePhoneNumberChange = (event) => {
    setUserData((prev) => ({
      ...prev,
      UserPhoneNumber: event.target.value,
    }));
  };

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
      const urlphotol = "http://localhost:5108/UploadUserPhoto";
      const formData = new FormData();
      formData.append("file", file);

      fetch(urlphotol + "/" + userData.userId, {
        method: "PUT",
        body: formData,
      })
        .then((res) => {
          console.log("res=", res);
          return res.json();
        })
        .then(
          () => {
            navigate("/EditProfileS2", { state: userData });
          },
          (error) => {
            console.log("err post=", error);
          }
        );
    } else {
      navigate("/StaffRegister2", { state: userData });
    }
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <form>
        <div className="registerdiv">
          <h2 style={{ textAlign: "center", margin: 0 }}>
            {userData.firstName} פרטים אישיים
          </h2>
        </div>
        <div
          style={{
            backgroundColor: "#cce7e8",
            padding: 10,
            borderRadius: 5,
            marginBottom: 30,
          }}
        >
          <h2 style={{ textAlign: "center", margin: 0 }}>
            {" "}
            פרטים אישיים {userData.firstName}{" "}
          </h2>
        </div>
        <TextField
          fullWidth
          margin="normal"
          label="שם פרטי"
          value={userData.UserPrivetName}
          InputProps={{ readOnly: true }}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="שם משפחה"
          value={userData.UserSurname}
          InputProps={{ readOnly: true }}
          variant="outlined"
          className="register-textfield"
        />

        <TextField
          fullWidth
          margin="normal"
          label="תעודת זהות"
          value={userData.UserId}
          InputProps={{ readOnly: true }}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="תאריך לידה"
          value={userData.UserBirthDate}
          InputProps={{ readOnly: true }}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="מספר טלפון"
          value={userData.UserPhoneNumber}
          onChange={handlePhoneNumberChange}
          variant="outlined"
          className="register-textfield"
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          color="primary"
          sx={{ mt: 2, mb: 2 }}
        >
          העלאת תמונה
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          המשך
        </Button>
      </form>
      {EfooterS}
    </>
  );
}
