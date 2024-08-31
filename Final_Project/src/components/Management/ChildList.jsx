import { useEffect, useState } from "react";
import "../../assets/StyleSheets/BirthDayList.css";
import { fetchBirthdays } from "../../utils/apiCalls";
import { nanoid } from "nanoid";
import { useLocation } from "react-router-dom";

export default function ChildList() {
  const [birthdays, setBirthdays] = useState([]);
  const location = useLocation();
  const [kindergartenNumber, setkindergartenNumber] = useState(location.state);

  useEffect(() => {
    async function getBirthdays() {
      try {
        const birth = await fetchBirthdays();
        setBirthdays(birth);
      } catch (error) {
        console.error(error);
      }
    }
    getBirthdays();
  }, []);

  return (
    <div className="page-container flex-column">
      <div className="padded-container flex-column radius-25">
        <h1 className="white">רשימת ילדים </h1>
        <div className="flex-column height-90-percent scroll gap-20">
          {birthdays
            .sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate))
            .map((b) => (
              <BirthdayRow key={nanoid()} child={b} />
            ))}
        </div>
      </div>
    </div>
  );
}

export function BirthdayRow({ child }) {
  const birthdaySplit = child.birthDate.split("-");

  return (
    <div className="birthday-row">
      <div className="flex-row gap-8 center">
        <img
          className="avatar"
          src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?cs=srgb&dl=pexels-bess-hamiti-83687-35537.jpg&fm=jpg"
        />
        <h2>{child.fullName}</h2>
      </div>
      <h2>{`${birthdaySplit[2]}-${birthdaySplit[1]}-${birthdaySplit[0]}`}</h2>
    </div>
  );
}
