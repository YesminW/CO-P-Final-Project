import { useEffect, useState } from "react";
import EfooterS from "../../Elements/EfooterS";
import {
  GetStaffofKindergarten,
  getUserById,
  getUserimage,
} from "../../utils/apiCalls";
import "../../assets/StyleSheets/TeamStaff.css";
import { nanoid } from "nanoid";
import { formatDate } from "../../utils/functions";
import EfooterP from "../../Elements/EfooterP";

export default function TeamStaff() {
  const [team, setTeam] = useState([]);
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");
  useEffect(() => {
    async function getStream() {
      try {
        const currentMonth = new Date().getMonth() + 1;
        const teamData = await GetStaffofKindergarten(
          kindergartenNumber,
          currentMonth
        );

        const finalTeam = [];
        for (const t of teamData) {
          const [
            teacher,
            assistant1,
            assistant2,
            teacherImg,
            assistant1Img,
            assistant2Img,
          ] = await Promise.all([
            getUserById(t.teacherID),
            getUserById(t.assistant1ID),
            getUserById(t.assistant2ID),
            getUserimage(t.teacherID),
            getUserimage(t.assistant1ID),
            getUserimage(t.assistant2ID),
          ]);
          finalTeam.push({
            activityDate: t.activityDate,
            teacher,
            assistant1,
            assistant2,
            teacherImg: URL.createObjectURL(teacherImg),
            assistant1Img: URL.createObjectURL(assistant1Img),
            assistant2Img: URL.createObjectURL(assistant2Img),
          });
        }

        setTeam(finalTeam);
      } catch (error) {
        console.error(error);
      }
    }

    getStream();
  }, []);

  return (
    <div className="page-container flex-column">
      <div className="padded-container flex-column radius-25">
        <div className="flex-row space-between center-a">
          <h1 className="white">
            {" "}
            {new Date().toLocaleString("he-il", { month: "long" })}
          </h1>
        </div>
        <div className="one-column-grid scroll">
          {team.map((t) => (
            <GridItem key={nanoid()} team={t} />
          ))}
        </div>
      </div>
      {localStorage.getItem("role_code") === "111" ? EfooterS : EfooterP}
    </div>
  );
}

function GridItem({ team }) {
  return (
    <div className="flex-column center duty-grid-item radius-25">
      <h2 className="white">{formatDate(new Date(team.activityDate))}</h2>
      <div className="flex-row space-between width-full padding-h-10px">
        <div className="flex-column">
          <img
            className="avatar"
            src={team.teacherImg}
            onError={(e) => (e.target.srcset = "./Images/default.png")}
          />
          <p className="white">{team.teacher.userPrivetName}</p>
        </div>
        <div className="flex-column ">
          <img
            className="avatar"
            src={team.assistant1Img}
            onError={(e) => (e.target.srcset = "./Images/default.png")}
          />
          <p className="white">{team.assistant1.userPrivetName}</p>
        </div>
        <div className="flex-column ">
          <img
            className="avatar"
            src={team.assistant2Img}
            onError={(e) => (e.target.srcset = "./Images/default.png")}
          />
          <p className="white">{team.assistant2.userPrivetName}</p>
        </div>
      </div>
    </div>
  );
}
