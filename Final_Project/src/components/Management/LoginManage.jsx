import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Elogo from "../../Elements/Elogo";
import { login } from "../../utils/apiCalls";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function LoginManage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setErrors] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function loginUserM(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const { userId } = await login(data);
      localStorage.setItem("user_id", userId);
      navigate("/AddsAndP");
    } catch (error) {
      console.error(error);
      setErrors("המייל / הסיסמא שגויים");
    }
  }

  return (
    <form onSubmit={loginUserM}>
      {Elogo}
      <br />
      <input type="text" className="inputs" placeholder="שם משתמש" name="ID" />
      <br />
      <div className="inputs flex-row">
        <input
          className="password-inputs"
          type={showPassword ? "text" : "password"}
          placeholder="סיסמא"
          name="password"
        />

        <i onClick={handleClickShowPassword}>
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </i>
      </div>

      <div className="buttons flex-column">
        <button className="custom-btn" type="submit">
          כניסה
        </button>
        <Link to="/ManagerRegister" className="custom-btn">
          הרשמה
        </Link>
      </div>
      {error && <p className="perrors">{error}</p>}
    </form>
  );
}
