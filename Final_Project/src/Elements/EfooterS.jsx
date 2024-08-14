import logo from "/Images/logo.png";
import "../assets/StyleSheets/Footer.css";
import { Link } from "react-router-dom";

import { Notifications, People } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const EfooterS = (
  <div className="footer-icons center-a">
    <Link style={{ width: "10%" }} to="/MainStaffMember">
      <img src={logo} alt="My Logo" className="logofooter" />
    </Link>
    <Link to="/TeamStaff">
      <IconButton>
        <People sx={{ fontSize: 30 }} className="footer-icon" />
      </IconButton>
    </Link>
    <Link to="/CalendarStaff">
      <IconButton>
        <EditCalendarOutlinedIcon
          sx={{ fontSize: 30 }}
          className="footer-icon"
        />
      </IconButton>
    </Link>
    <Link to="/Meals">
      <IconButton>
        <RestaurantMenuOutlinedIcon
          sx={{ fontSize: 30 }}
          className="footer-icon"
        />
      </IconButton>
    </Link>
    <Link>
      <IconButton>
        <Notifications sx={{ fontSize: 30 }} className="footer-icon" />
      </IconButton>
    </Link>
    <IconButton>
      <SendOutlinedIcon sx={{ fontSize: 30 }} className="footer-icon" />
    </IconButton>
  </div>
);

export default EfooterS;
