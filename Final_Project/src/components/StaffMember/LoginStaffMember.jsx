import React, { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import Elogo from "../../Elements/Elogo";
import { login } from "../../utils/apiCalls";

export default function LoginStaffMember() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setErrors] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function loginUserS(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const { user_id } = await login(data);
      localStorage.setItem("user_id", user_id);
      navigate("/MainStaffMember");
    } catch (error) {
      console.error(error);
      setErrors("המייל / הסיסמא שגויים");
    }
  }

  return (
    <form onSubmit={loginUserS}>
      {Elogo}
      <br />
      <FormControl fullWidth margin="normal" style={{ width: "80%" }}>
        <TextField
          id="ID"
          label="שם משתמש"
          name="ID"
          type="text"
          variant="outlined"
          className="custom-textfield"
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal" style={{ width: "80%" }}>
        <TextField
          id="password"
          label="סיסמא"
          name="password"
          className="custom-textfield"
          required
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <div className="buttons">
        <button className="btn">כניסה</button>
      </div>
      {error && <p style={{ color: "#6196A6" }}>{error}</p>}
    </form>
  );
}
