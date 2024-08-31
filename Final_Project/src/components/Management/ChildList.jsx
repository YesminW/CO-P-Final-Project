import { useEffect, useState } from "react";
import "../../assets/StyleSheets/BirthDayList.css";
import {
  deleteChild,
  fetchBirthdays,
  getChildByKindergarten,
} from "../../utils/apiCalls";
import { nanoid } from "nanoid";
import { Link, useLocation } from "react-router-dom";

export default function ChildList() {
  const [children, setChildren] = useState([]);
  const location = useLocation();
  const [kindergarten, setkindergarten] = useState(location.state);

  useEffect(() => {
    async function getChildren() {
      try {
        const child = await getChildByKindergarten(
          kindergarten.kindergartenNumber
        );
        console.log(child);

        setChildren(child);
      } catch (error) {
        console.error(error);
      }
    }
    getChildren();
  }, []);

  return (
    <div className="page-container flex-column">
      <div className="padded-container flex-column radius-25">
        <div className="flex-row space-evenly">
          <Link
            to="/KindergartenDetails"
            state={kindergarten}
            className="backbtn"
          >
            {"<"}
          </Link>
          <h1 className="h1child">רשימת ילדים </h1>
        </div>
        <div className="flex-column height-90-percent scroll gap-20">
          {children.map((b) => (
            <ChildRow key={nanoid()} child={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChildRow({ child }) {
  const handleDelete = async (e) => {
    try {
      console.log(child.childId);

      const response = await deleteChild(child.childId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="birthday-row">
      <div className="flex-row gap-8 center">
        <img
          className="avatar"
          src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?cs=srgb&dl=pexels-bess-hamiti-83687-35537.jpg&fm=jpg"
        />
        <h2>
          {child.childFirstName} {child.childSurname}
        </h2>
        <button className="deletebtn" onClick={handleDelete}>
          מחק
        </button>
      </div>
    </div>
  );
}
