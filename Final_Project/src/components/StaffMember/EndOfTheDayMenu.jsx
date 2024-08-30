import { Link } from "react-router-dom";
import "../../assets/StyleSheets/EndOfTheDayMenu.css";
import EfooterS from "../../Elements/EfooterS";

export default function EndOfTheDayMenu() {
  return (
    <div className="menudiv flex-column center">
      <Link className="menulink">כתיבת סיכום יום</Link>
      <Link className="menulink" to="/Presence">
        נוכחות
      </Link>
      <Link className="menulink">העלאת תמונות</Link>
      <Link className="menulink">התראות להורים</Link>
      {EfooterS}
    </div>
  );
}
