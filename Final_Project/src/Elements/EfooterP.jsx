import logo from '../Images/logo.png'
import '../assets/StyleSheets/Footer.css'
import { Link } from 'react-router-dom';


import { Notifications, People } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';


const Efooterp =
    <div className="footer-icons">
        <Link style={{width: '10%'}} to="/MainParent">
            <img src={logo} alt="My Logo" className="logofooter" />
        </Link>
        <Link to="/MainParent">
            <IconButton >
                <People className="footer-icon" />
            </IconButton>
        </Link>
        <Link>
            <IconButton >
                <EditCalendarOutlinedIcon className="footer-icon" />
            </IconButton>
        </Link>
        <Link>
            <IconButton >
                <RestaurantMenuOutlinedIcon className="footer-icon" />
            </IconButton>
        </Link>
        <Link>
            <IconButton >
                <Notifications className="footer-icon" />
            </IconButton>
        </Link>
        <IconButton >
            <SendOutlinedIcon className="footer-icon" />
        </IconButton>
    </div>

export default Efooterp;