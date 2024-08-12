import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress, TextField } from "@mui/material";
import EfooterP from "../../Elements/EfooterP";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateUserById, uploadUserPhoto } from "../../utils/apiCalls";

export default function EditProfileP() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const location = useLocation();
  const [details, setDetails] = useState(location.state);
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.UserEmail)
      ) {
        console.error("Not a valid email");
        return;
      }
      if (!data["UserpPassword"].trim()) {
        data["UserpPassword"] = details.UserpPassword;
      }
      const promises = [updateUserById(data)];
      if (file) promises.push(uploadUserPhoto({ userId: data.userId, file }));
      await Promise.all(promises);
      navigate("/MainParent");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "#cce7e8",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <h2 style={{ textAlign: "center", margin: 0 }}>
            {" "}
            פרטים אישיים {details.UserPrivetName}{" "}
          </h2>
        </div>
        <TextField
          fullWidth
          margin="normal"
          label="תעודת זהות"
          name="userId"
          value={details.UserId}
          InputProps={{ readOnly: true }}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="שם פרטי"
          name="UserPrivetName"
          InputProps={{ readOnly: true }}
          value={details.UserPrivetName}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="שם משפחה"
          InputProps={{ readOnly: true }}
          name="UserSurname"
          value={details.UserSurname}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="כתובת"
          name="UserAddress"
          value={details.UserAddress}
          onChange={handleInputChange}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="מייל"
          name="UserEmail"
          type="email"
          value={details.UserEmail}
          onChange={handleInputChange}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="פלאפון"
          name="UserPhoneNumber"
          value={details.UserPhoneNumber}
          onChange={handleInputChange}
          variant="outlined"
          className="register-textfield"
        />
        <TextField
          fullWidth
          margin="normal"
          label="שינוי סיסמא"
          type="password"
          name="UserpPassword"
          variant="outlined"
          className="register-textfield"
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={0}
          startIcon={<CloudUploadIcon />}
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
          <input
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={handleFileUpload}
          />
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress /> : "אישור"}
        </Button>
      </form>
      {EfooterP}
    </>
  );
}
