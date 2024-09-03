import { useEffect, useState } from "react";
import EfooterS from "../../Elements/EfooterS";
import { getAllChildDuty, getChildPhoto } from "../../utils/apiCalls";
import { nanoid } from "nanoid";
import "../../assets/StyleSheets/childDuty.css";

export default function ChildDuty() {
  const [duties, setDuties] = useState([]);
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");

  useEffect(() => {
    async function getChildDuties() {
      try {
        const d = await getAllChildDuty(kindergartenNumber);
        const dutiesToSave = [];
        for (const duty of d) {
          const image1 = await getChildPhoto(duty.child1);
          const image2 = await getChildPhoto(duty.child2);
          const date = new Date(duty.dutyDate);
          const url1 = URL.createObjectURL(image1);
          const url2 = URL.createObjectURL(image2);

          dutiesToSave.push({
            ...d,
            child1Name: duty.child1Name,
            child2Name: duty.child2Name,
            url1,
            url2,
            dutyDate: date,
          });
        }
        setDuties(dutiesToSave);
      } catch (error) {
        console.error(error);
      }
    }
    getChildDuties();
  }, []);

  return (
    <div className="page-container flex-column">
      <div className="padded-container flex-column radius-25">
        <h1 className="white">
          {new Date().toLocaleString("he-il", { month: "long" })}
        </h1>
        <div className="two-column-grid scroll">
          {duties.map((duty) => (
            <GridItem key={nanoid()} duty={duty} />
          ))}
        </div>
      </div>
      {EfooterS}
    </div>
  );
}

export function GridItem({ duty }) {
  return (
    <div className="flex-column space-evenly duty-grid-item radius-25">
      <h2 className="h2duty">{`${duty.dutyDate.getDate()}-${
        duty.dutyDate.getMonth() + 1
      }`}</h2>
      <div className="flex-row space-evenly">
        <div className="flex-column">
          <img
            className="avatar"
            src="https://media.istockphoto.com/id/1353379172/photo/cute-little-african-american-girl-looking-at-camera.jpg?s=612x612&w=0&k=20&c=RCOYytwS2nMGfEb80oyeiCcIiqMQu6wnTluAaxMBye4="
          />
          <p className="white">{duty.child1Name}</p>
        </div>
        <div className="flex-column">
          <img
            className="avatar"
            src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?cs=srgb&dl=pexels-bess-hamiti-83687-35537.jpg&fm=jpg"
          />
          <p className="white">{duty.child2Name}</p>
        </div>
      </div>
    </div>
  );
}
