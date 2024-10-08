import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EfooterS from "../../Elements/EfooterS";

import "../../assets/StyleSheets/Presence.css";
import {
  getChildByKindergarten,
  getChildPhoto,
  getDailyAttendance,
  updateChildAttendence,
} from "../../utils/apiCalls";
import { formatForCSharp } from "../../utils/functions";
import { Link } from "react-router-dom";

export default function Presence() {
  const [childrenData, setChildrenData] = useState([]);
  const [attendanceData, setAttendance] = useState([]);
  const [filter, setFilter] = useState("");
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [children, attendance] = await Promise.all([
          getChildByKindergarten(kindergartenNumber),
          getDailyAttendance(formatForCSharp(new Date())),
        ]);

        for (const child of children) {
          const photo = await getChildPhoto(child.childId);
          child.img = URL.createObjectURL(photo);
        }

        setChildrenData(children);
        setAttendance(attendance);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, []);

  const handleStudentClick = async (childId) => {
    try {
      const attendence = await updateChildAttendence(
        childId,
        formatForCSharp(new Date())
      );
      setAttendance((prev) => {
        const a = prev.find(
          (p) => p.dailyAttendanceId === attendence.dailyAttendanceId
        );
        if (a) {
          return prev.map((p) => {
            if (p.dailyAttendanceId === a.dailyAttendanceId) {
              p.attendanceStatus = attendence.attendanceStatus;
            }
            return p;
          });
        } else {
          return [...prev, attendence];
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const filteredChildren = childrenData.filter(
    (c) => c.childFirstName.includes(filter) || c.childSurname.includes(filter)
  );

  return (
    <>
      <div>
        <div className="presencetitle">
          <h2 className="presencetitleText">נוכחות</h2>
        </div>
        <Box className="header">
          <Link className="btnchat" to="/ChatList">
            צ'אט עם הורה
          </Link>
          <Box className="search-box">
            <input
              type="text"
              placeholder="חיפוש"
              className="search-input"
              onChange={(e) => setFilter(e.target.value)}
            />
            <IconButton style={{ color: "#07676D" }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
        <div className="presence-container">
          <Box className="students-grid">
            {filteredChildren.length === 0 ? (
              <h2>אין ילדים התואמים את החיפוש</h2>
            ) : (
              filteredChildren.map((student) => (
                <Box
                  key={student.childId}
                  className={`student-circle ${
                    attendanceData.find((a) => a.childId === student.childId) &&
                    (attendanceData.find((a) => a.childId === student.childId)[
                      "attendanceStatus"
                    ] === "1"
                      ? "student-circle-present"
                      : attendanceData.find(
                          (a) => a.childId === student.childId
                        )["attendanceStatus"] === "2"
                      ? "student-circle-went-home"
                      : "")
                  }`}
                  onClick={() => handleStudentClick(student.childId)}
                >
                  <img
                    src={student.img}
                    onError={(e) => (e.target.srcset = "./Images/default.png")}
                    alt={`${student.childFirstName} ${student.childSurname}`}
                    className="student-avatar"
                  />
                  <Typography
                    style={{ fontFamily: "Karantina", fontSize: "20px" }}
                    className="student-name"
                  >
                    {student.childFirstName} {student.childSurname}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </div>
        {EfooterS}
      </div>
    </>
  );
}
