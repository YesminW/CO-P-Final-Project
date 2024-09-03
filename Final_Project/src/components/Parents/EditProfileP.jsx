import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress, TextField } from "@mui/material";
import EfooterP from "../../Elements/EfooterP";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateUserById, uploadUserPhoto } from "../../utils/apiCalls";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function EditProfileP() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [details, setDetails] = useState(location.state);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
      if (!data["UserpPassword"].trim()) {
        data["UserpPassword"] = details.userpPassword;
      }
      const promises = [updateUserById(data)];
      if (file) promises.push(uploadUserPhoto({ userId: data.userId, file }));
      await Promise.all(promises);
      navigate("/EditProfile");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="scroll">
        <div className="privatediv">
          <h2 className="h2private">פרטים אישיים {details.userPrivetName}</h2>
        </div>
        <input
          name="userId"
          className="register-input"
          variant="outlined"
          defaultValue={details.userId}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="UserPrivetName"
          className="register-input"
          variant="outlined"
          defaultValue={details.userPrivetName}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          name="UserSurname"
          className="register-input"
          variant="outlined"
          defaultValue={details.userSurname}
          inputprops={{ readOnly: true }}
        />
        <br />
        <input
          placeholder="כתובת"
          name="UserAddress"
          className="register-input"
          variant="outlined"
          value={details.userAddress}
          onChange={handleInputChange}
        />
        <br />
        <input
          placeholder="אימייל"
          name="UserEmail"
          className="register-input"
          variant="outlined"
          value={details.userEmail}
          onChange={handleInputChange}
        />
        <br />
        <input
          name="userPhoneNumber"
          type="numbers"
          className="register-input"
          variant="outlined"
          value={details.userPhoneNumber}
          onChange={handleInputChange}
        />
        <br />
        <div className="register-inputs flex-row">
          <input
            className="password-inputs"
            type={showPassword ? "text" : "password"}
            placeholder="סיסמא"
            name="UserpPassword"
            onChange={handleInputChange}
          />

          <i onClick={handleClickShowPassword}>
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </i>
        </div>
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
