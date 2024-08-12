import {
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import Elogo from "../../Elements/Elogo";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { login } from "../../utils/apiCalls";
import { useNavigate } from "react-router-dom";

export default function LoginParent() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [error, setErrors] = useState("");
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    async function loginUserP(e) {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const { user_id } = await login(data);
            localStorage.setItem("user_id", user_id);
            navigate("/MainParent");
        } catch (error) {
            console.error(error);
            setErrors("המייל / הסיסמא שגויים");
        }
    }

    return (
        <form onSubmit={loginUserP}>
            {Elogo}
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
                    type={showPassword ? "text" : "password"}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
            <button type="submit" className="btn">
                כניסה
            </button>
            {error && <p style={{ color: "#6196A6" }}>{error}</p>}
        </form>
    );
}
