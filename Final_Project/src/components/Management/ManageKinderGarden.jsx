import React, { useEffect, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

export default function KindergartenManagement() {
    const navigate = useNavigate();
    const [kindergartens, setKindergartens] = useState([])


    useEffect(() => {

        const urlK = 'http://localhost:5108/ShowKindergarten'

        fetch(urlK, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(response => response.json())
            .then(
                (data) => {
                    setKindergartens(data);
                },
                () => {
                    console.log(error)
                });
    }, []);

    const handleAddKindergarten = () => {
        navigate('/AddKindergarden');
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{
                backgroundColor: '#8aa7a7',
                padding: '20px',
                borderRadius: '10px',
                width: '300px',
                margin: 'auto',
                marginTop: '20px'
            }}
        >
            <Typography variant="h4" ב>
                ניהול גנים
            </Typography>
            {kindergartens.map((kindergarten, index) => (
                <Link key={index}
                    to={`/KindergartenDetails/${encodeURIComponent(kindergarten.kindergartenName)}`}
                    style={{ textDecoration: 'none', width: '100%' }} >
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: '#B9DCD1',
                            color: 'white',
                            margin: '10px 0',
                            width: '250px', // Increase width
                            height: '60px', // Increase height
                            fontSize: '28px', // Increase font size
                            fontFamily: 'Karantina',
                            borderRadius: '10px'


                        }}
                    >
                        {kindergarten.kindergartenName}
                    </Button>
                </Link>
            ))}
            <Button
                variant="contained"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.28)',
                    color: 'white',
                    marginTop: '20px',
                    fontSize: '25px',
                    fontFamily: 'Karantina'

                }}
                onClick={handleAddKindergarten}
            >
                הוספת גן
            </Button>
        </Box>
    );
}
