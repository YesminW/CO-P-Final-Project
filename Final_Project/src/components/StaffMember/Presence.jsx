import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Avatar, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EfooterS from '../../Elements/EfooterS';
import defaultimg from '../../Images/default.png';

import '../../assets/StyleSheets/Presence.css';

export default function Presence() {
    const [studentData, setStudentData] = useState([]); // Use a descriptive name
    const [selectedStudentId, setSelectedStudentId] = useState(null); // Track selected student

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5108/AllChild', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleStudentClick = (ChildID) => {
        setSelectedStudentId(ChildID === selectedStudentId ? null : ChildID); // Toggle selection
    };

    return (
        <>
            <div >
                <div className="presencetitle">
                    <h2 className="presencetitleText">נוכחות</h2>
                </div>
                <Container className="presence-container">
                    <Box className="header">
                        <Box className="search-box">
                            <input type="text" placeholder="חיפוש" className="search-input" />
                            <IconButton style={{ color: '#07676D' }}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <Button
                            style={{ backgroundColor: 'white', color: '#07676D', fontFamily: 'Karantina', fontSize: '18px', borderRadius: '5px' }}
                        >
                            צ'אט עם הורה
                        </Button>
                    </Box>
                    <Box className="students-grid">
                        {studentData.map((student) => (
                            <Box
                                key={student.ChildID} // שימוש ב-ID ייחודי
                                className={`student-circle ${selectedStudentId === student.ChildID ? 'selected' : ''}`} // Use a clear class for selection
                                onClick={() => handleStudentClick(student.ChildID)} // Handle click event
                            >
                                <Avatar src={student.imgSrc || defaultimg} alt={`${student.ChildFirstName} ${student.ChildSurname}`} className="student-avatar" />
                                <Typography style={{ fontFamily: 'Karantina', fontSize: '15px' }} className="student-name">
                                    {student.ChildFirstName} {student.ChildSurname}
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
