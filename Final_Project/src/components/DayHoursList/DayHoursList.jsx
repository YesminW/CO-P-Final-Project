import { nanoid } from "nanoid";
import { formatDate, generateTimeSlots } from "../../utils/functions";
import { useLocation, useNavigate } from "react-router-dom";
import { hebrewWeekDays } from "../../utils/constants";
import EfooterS from "../../Elements/EfooterS";

export default function DayHoursList() {
  const location = useLocation();
  const timeSlots = generateTimeSlots();
  const date = location.state;
  const navigate = useNavigate();

  const handleHourClick = (time) => {
    const [hours, minutes] = time.split(":");
    const dateToSend = new Date(date);
    dateToSend.setHours(hours);
    dateToSend.setMinutes(minutes);
    console.log(dateToSend);
    navigate("/ActivitiesList", { state: dateToSend });
  };

  return (
    <div className="page-container usual-background">
      <div>
        <h1 className="rounded-teal-container padding-v-40 flex-column gap-20">
          לוז שבועי
        </h1>
        <p className="rounded-teal-container font-30">{`${
          hebrewWeekDays[date.getDay()]
        } ${formatDate(date)}`}</p>
      </div>
      <div className="flex-column height-60 scroll gap-20 padding-v-20">
        {timeSlots.map((time) => (
          <div key={nanoid()} className="flex-row gap-20">
            <span className="rounded-teal-container width-100 font-20">
              {time}
            </span>
            <button
              onClick={() => handleHourClick(time)}
              type="text"
              className="flex-length cool-input padding-h-10px"
            ></button>
          </div>
        ))}
      </div>
      {EfooterS}
    </div>
  );
}
