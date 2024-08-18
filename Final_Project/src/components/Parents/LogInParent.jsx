import Elogo from "../../Elements/Elogo";
import { useState } from "react";
import { login } from "../../utils/apiCalls";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function LoginParent() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setErrors] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function loginUserP(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const { user_id, user_code } = await login(data);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", user_code);
      navigate("/MainParent");
    } catch (error) {
      console.error(error);
      setErrors("המייל / הסיסמא שגויים");
    }
  }

  return (
    <form onSubmit={loginUserP}>
      {Elogo}
      <br />
      <input
        type="text"
        className="inputs"
        placeholder="שם משתמש"
        name="ID"
        required
      />
      <br />
      <div className="inputs flex-row">
        <input
          className="password-inputs"
          type={showPassword ? "text" : "password"}
          placeholder="סיסמא"
          name="password"
          required
        />

        <i onClick={handleClickShowPassword}>
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </i>
      </div>
      <button className="custom-btn" type="submit">
        כניסה
      </button>
      {error && <p style={{ color: "#6196A6" }}>{error}</p>}
    </form>
  );
}
