import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import Efooterp from '../../Elements/EfooterP';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import '../../assets/StyleSheets/Register.css';

export default function EditProfileChild() {
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        firstName: '',
        lastName: '',
        idNumber: '',
        birthDate: '',
    });

    useEffect(() => {
        const storedChild = JSON.parse(sessionStorage.getItem('childData'));
        if (storedChild) {
            setDetails({
                firstName: storedChild.childFirstName || '',
                lastName: storedChild.ChildSurname || '',
                idNumber: storedChild.childID || '',
                birthDate: storedChild.childBirthDate || '',
            });
        }
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
            console.log('Uploaded file:', file);
        } else {
            alert('יש להעלות קובץ מסוג JPG או JPEG בלבד.');
        }
    };

    const handleSubmit = () => {
        navigate('/EditProfile');
    };

    return (
        <>
            <form>
                <div className='registerdiv'>
                    <h2 style={{ textAlign: 'center', margin: 0 }}> פרטים אישיים {details.firstName} </h2>
                </div>
                <TextField
                    fullWidth
                    margin="normal"
                    label="שם פרטי"
                    value={details.firstName}
                    InputProps={{ readOnly: true }}
                    className='register-textfield'
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="שם משפחה"
                    value={details.lastName}
                    InputProps={{ readOnly: true }}
                    className='register-textfield'
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="תעודת זהות"
                    value={details.idNumber}
                    InputProps={{ readOnly: true }}
                    className='register-textfield'
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="תאריך לידה"
                    value={details.birthDate}
                    InputProps={{ readOnly: true }}
                    className='register-textfield'
                    variant="outlined"
                />
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={0}
                    startIcon={<CloudUploadIcon />}
                    sx={{
                        margin: '20px',
                        backgroundColor: '#076871',
                        '&:hover': {
                            backgroundColor: '#6196A6',
                        }
                    }}
                >
                    העלאת תמונת פרופיל
                    <input
                        type="file"
                        name="file"
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg"
                        onChange={handleFileUpload}
                    />
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate('/Allergies')}
                    className="btn"
                >
                    אלרגיות
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    אישור
                </Button>
            </form>
            <Button
                variant="text"
                color="primary"
                onClick={() => navigate(-1)}
            >
                <ArrowForwardIosOutlinedIcon />
            </Button>
            {Efooterp}
        </>
    );
}
