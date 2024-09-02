import { Link } from "react-router-dom";
import "../../assets/StyleSheets/EndOfTheDayMenu.css";
import EfooterS from "../../Elements/EfooterS";
import { useState } from "react";
import { uploaspictures } from "../../utils/apiCalls";

export default function EndOfTheDayMenu() {
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      UploadFile(selectedFile);
    }
  };

  async function UploadFile(file) {
    try {
      const data = await uploaspictures(file);
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
      />
      <label htmlFor="upload-button" className="menulink">
        העלאת תמונות
      </label>
      <Link className="menulink">התראות להורים</Link>
      {EfooterS}
    </div>
  );
}
