import { useState } from "react";
import EfooterS from "../../Elements/EfooterS";

export default function EndOfTheDay() {
  const [date, setDate] = useState(new Date());

  function formatdate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }
  return (
    <div className="menudiv flex-column center-a">
      <h1 className="menulink">כתיבת סיכום יום</h1>
      <form className="maindiv flex-column center-a space-between">
        <div className="flex-row datesdiv space-between">
          <button type="button" className="datesbtn flex-row center">
            {"<"}
          </button>
          <p className="datep flex-row center">{formatdate(date)}</p>
          <button type="button" className="datesbtn flex-row center">
            {">"}
          </button>
        </div>
        <textarea className="summaryt" name="summarytext" />
        <button className="sendbtn">שלח</button>
      </form>
      {EfooterS}
    </div>
  );
}
