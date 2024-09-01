import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Elogo from "../../Elements/Elogo";
import { login } from "../../utils/apiCalls";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function LoginStaffMember() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setErrors] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function loginUserS(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const user_Data = await login(data);
      localStorage.setItem("user_id", user_Data.userId);
      localStorage.setItem("role_code", user_Data.userCode);
      localStorage.setItem("kindergartenNumber", user_Data.kindergartenNumber);
      if (user_Data.user_code == "222") {
        navigate("/MainParent");
      } else {
        navigate("/MainStaffMember");
      }
    } catch (error) {
      setErrors("המייל / הסיסמא שגויים");
    }
  }

  return (
    <form onSubmit={loginUserS}>
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
      <button className="custom-btn" type="submit">
        כניסה
      </button>
      {error && <p className="perrors">{error}</p>}
    </form>
  );
}
