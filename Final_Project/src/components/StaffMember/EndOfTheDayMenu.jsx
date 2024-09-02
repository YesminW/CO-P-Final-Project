import { Link } from "react-router-dom";
import "../../assets/StyleSheets/EndOfTheDayMenu.css";
import EfooterS from "../../Elements/EfooterS";
import { useState } from "react";
import { uploaspictures } from "../../utils/apiCalls";

export default function EndOfTheDayMenu() {
  // const [file, setFile] = useState([]);
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");
  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];

    selectedFiles && UploadFile(selectedFiles);
  };

  async function UploadFile(files) {
    try {
      const data = await uploaspictures(files, kindergartenNumber);
    } catch (error) {
      console.error(error);
    }
  }

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
        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
        onChange={handleFileChange}
        id="upload-button"
        multiple
      />
      <label htmlFor="upload-button" className="menulink">
        העלאת תמונות
      </label>
      <Link className="menulink">התראות להורים</Link>
      {EfooterS}
    </div>
  );
}
