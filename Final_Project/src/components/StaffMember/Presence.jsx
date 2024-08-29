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
import { getAllChild } from "../../utils/apiCalls";

export default function Presence() {
  const [childrenData, setChildrenData] = useState([]); // Use a descriptive name
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Track selected student

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const children = await getAllChild();
        setChildrenData(children);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentClick = (childId) => {
    setSelectedStudentId(childId); // Toggle selection
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
                key={student.childId} // שימוש ב-ID ייחודי
                className={`student-circle ${
                  selectedStudentId === student.childId &&
                  "student-circle-present"
                }`} // Use a clear class for selection
                onClick={() => handleStudentClick(student.childId)} // Handle click event
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
