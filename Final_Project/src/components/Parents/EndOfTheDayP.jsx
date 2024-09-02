import { useEffect, useState } from "react";
import { getDaySummaryByDate } from "../../utils/apiCalls";
import EfooterP from "../../Elements/EfooterP";
import { formatForCSharp } from "../../utils/functions";

export default function EndOfTheDayP() {
  const [date, setDate] = useState(new Date());
  const [summary, setSummary] = useState("");
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");

  useEffect(() => {
    async function getSummary() {
      const data = await getDaySummaryByDate(
        formatForCSharp(date),
        kindergartenNumber
      );
      if (data == "Day summary not found") {
        setSummary("");
      } else {
        setSummary(data);
      }
    }
    getSummary();
  }, [date]);

  async function sendSummary(e) {
    e.preventDefualt();
  }
  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };

  function formatdate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }

  return (
    <div className="menudiv flex-column center-a">
      <h1 className="menulink">סיכום יום</h1>
      <form
        onSubmit={sendSummary}
        className="maindiv flex-column center-a space-between"
      >
        <div className="flex-row datesdiv space-between">
          <button
            type="button"
            className="datesbtn flex-row center"
            onClick={() => changeDate(1)}
          >
            {"<"}
          </button>
          <p className="datep flex-row center">{formatdate(date)}</p>
          <button
            type="button"
            className="datesbtn flex-row center"
            onClick={() => changeDate(-1)}
          >
            {">"}
          </button>
        </div>
        <p className="summaryt">{summary}</p>
      </form>
      {EfooterP}
    </div>
  );
}
