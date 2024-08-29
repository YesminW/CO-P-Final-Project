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
import defaultimg from "/Images/default.png";

import "../../assets/StyleSheets/Presence.css";
import {
  getAllChild,
  getDailyAttendance,
  updateChildAttendence,
} from "../../utils/apiCalls";
import { formatForCSharp } from "../../utils/functions";

export default function Presence() {
  const [childrenData, setChildrenData] = useState([]); // Use a descriptive name
  const [attendanceData, setAttendance] = useState([]); // Track selected student

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [children, attendance] = await Promise.all([
          getAllChild(),
          getDailyAttendance(formatForCSharp(new Date())),
        ]);

        console.log(attendance);

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
      console.log(attendence);
      setAttendance((prev) => {
        if (prev.includes(attendence)) {
        }
        prev.find(
          (p) => p.dailyAttendanceId === attendence.dailyAttendanceId
        ).attendanceStatus = attendence.attendanceStatus;
        return prev;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <div className="presencetitle">
          <h2 className="presencetitleText">נוכחות</h2>
        </div>
        <Container className="presence-container">
          <Box className="header">
            <Box className="search-box">
              <input type="text" placeholder="חיפוש" className="search-input" />
              <IconButton style={{ color: "#07676D" }}>
                <SearchIcon />
              </IconButton>
            </Box>
            <Button
              style={{
                backgroundColor: "white",
                color: "#07676D",
                fontFamily: "Karantina",
                fontSize: "18px",
                borderRadius: "5px",
              }}
            >
              צ'אט עם הורה
            </Button>
          </Box>
          <Box className="students-grid">
            {childrenData.map((student) => (
              <Box
                key={student.childId}
                className={`student-circle ${
                  // children
                  // atte
                  // atten has child.id
                  attendanceData.find((a) => a.childId === student.childId) &&
                  (attendanceData.find((a) => a.childId === student.childId)[
                    "attendanceStatus"
                  ] === "1"
                    ? "student-circle-present"
                    : attendanceData.find((a) => a.childId === student.childId)[
                        "attendanceStatus"
                      ] === "2"
                    ? "student-circle-went-home"
                    : "")
                }`}
                onClick={() => handleStudentClick(student.childId)}
              >
                <Avatar
                  src={student.imgSrc || defaultimg}
                  alt={`${student.childFirstName} ${student.childSurname}`}
                  className="student-avatar"
                />
                <Typography
                  style={{ fontFamily: "Karantina", fontSize: "15px" }}
                  className="student-name"
                >
                  {student.childFirstName} {student.childSurname}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
        {EfooterS}
      </div>
    </>
  );
}
