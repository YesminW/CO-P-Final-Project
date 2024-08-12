import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import '../../assets/StyleSheets/RegisterStaff.css';

import Efooterp from '../../Elements/EfooterP';

export default function Allergies() {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('currentUser'));

        if (storedUser) {
            setUserData(storedUser);
        }
    }, []);

    const [allergies, setAllergies] = useState([{ id: 1, severity: 0, treatment: '', type: '' }]);

    const addAllergy = () => {
        setAllergies([...allergies, { id: allergies.length + 1, severity: 0, treatment: '', type: '' }]);
    };

    const handleSeverityChange = (id, severity) => {
        setAllergies(allergies.map(allergy => allergy.id === id ? { ...allergy, severity } : allergy));
    };

    const handleTreatmentChange = (id, treatment) => {
        setAllergies(allergies.map(allergy => allergy.id === id ? { ...allergy, treatment } : allergy));
    };

    const handleTypeChange = (id, type) => {
        setAllergies(allergies.map(allergy => allergy.id === id ? { ...allergy, type } : allergy));
    };

    return (
        <>
            <form>
                <Box className="registerdiv">
                    <Typography variant="h4" className="registerh2">
                        פרטים אישיים {userData.firstName}
                    </Typography>
                    <IconButton color="primary" style={{ color: 'white' }} onClick={() => console.log('Navigate back')}>
                        <ArrowForwardIosOutlinedIcon />
                    </IconButton>
                </Box>
                {allergies.map(allergy => (
                    <Box key={allergy.id} mb={2} width="100%">
                        <FormControl fullWidth variant="outlined" className="register-textfield" margin="normal">
                            <InputLabel>אלרגיה</InputLabel>
                            <Select
                                value={allergy.type}
                                onChange={(e) => handleTypeChange(allergy.id, e.target.value)}
                                label="אלרגיה"
                            >
                                <MenuItem value=""><em>  </em></MenuItem>
                                <MenuItem value="צליאק">צליאק</MenuItem>
                                <MenuItem value="סכרת">סכרת</MenuItem>
                                <MenuItem value="סוטנים">סוטנים</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="subtitle1" component="p" style={{ color: 'white', marginBottom: '10px' }}>
                            דרגת חומרה
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <Button
                                    key={num}
                                    variant="contained"
                                    className="severity-button"
                                    style={{ backgroundColor: allergy.severity === num ? '#005662' : '#B4C6CD', color: 'black', borderRadius: '10px' }}
                                    onClick={() => handleSeverityChange(allergy.id, num)}
                                >
                                    {num}
                                </Button>
                            ))}
                        </Box>
                        <Typography variant="subtitle1" component="p" style={{ color: 'white', marginBottom: '10px' }}>
                            דרכי טיפול
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            className="register-textfield"
                            value={allergy.treatment}
                            onChange={(e) => handleTreatmentChange(allergy.id, e.target.value)}
                        />
                    </Box>
                ))}
                <Button
                    variant="contained"
                    fullWidth
                    className="btn1"
                    onClick={addAllergy}
                >
                    הוספת אלרגיה
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    className="btn1"
                >
                    אישור
                </Button>
            </form>
            {Efooterp}
        </>
    );
}
