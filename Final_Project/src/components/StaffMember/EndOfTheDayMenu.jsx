import { Link } from "react-router-dom";
import "../../assets/StyleSheets/EndOfTheDayMenu.css";
import EfooterS from "../../Elements/EfooterS";

export default function EndOfTheDayMenu() {
  async function uploadfile() {}

  return (
    <div className="menudiv flex-column center">
      <Link className="menulink" to="/EndOfTheDay">
        כתיבת סיכום יום
      </Link>
      <Link className="menulink" to="/Presence">
        נוכחות
      </Link>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={uploadfile}
        id="upload-button"
      />
      <label htmlFor="upload-button">
        <button className="menulink">העלאת תמונות</button>
      </label>
      <Link className="menulink">התראות להורים</Link>
      {EfooterS}
    </div>
  );
}
