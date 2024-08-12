import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EfooterS from '../../Elements/EfooterS';
import '../../assets/StyleSheets/RegisterStaff.css';

export default function EditProfileS2() {
  const location = useLocation();
  const initialDetails = location.state || {};
  const [details, setDetails] = useState(initialDetails);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlSR = 'http://localhost:5108/updateUser';

    fetch(urlSR + '/' + details.userId, {
      method: 'PUT',
      body: JSON.stringify(details),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8', // very important to add the 'charset=UTF-8'!!!!
      }),
    })
      .then((res) => {
        console.log('res=', res);
        return res.json();
      })
      .then(
        (result) => {
          console.log('fetch POST= ', result);
          console.log(result.Avg);
          navigate('/MainStaffMember');
        },
        (error) => {
          console.log('err post=', error);
        }
      );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: '#cce7e8', padding: 10, borderRadius: 5, marginBottom: 30 }}>
          <h2 style={{ textAlign: 'center', margin: 0 }}> פרטים אישיים {details.firstName} </h2>
        </div>
        <TextField
          fullWidth
          margin="normal"
          label="כתובת"
          name="userAddress"
          value={details.userAddress}
          onChange={handleChange}
          variant="outlined"
          className='register-textfield'
        />
        <TextField
          fullWidth
          margin="normal"
          label="מין"
          name="userGender"
          value={details.userGender}
          onChange={handleChange}
          variant="outlined"
          className='register-textfield'
        />
        <TextField
          fullWidth
          margin="normal"
          label="אימייל"
          name="userEmail"
          value={details.userEmail}
          onChange={handleChange}
          variant="outlined"
          className='register-textfield'
        />
        <TextField
          fullWidth
          margin="normal"
          label="בעיות בריאות"
          name="healthIssues"
          value={details.healthIssues}
          onChange={handleChange}
          variant="outlined"
          className='register-textfield'
        />
        <TextField
          fullWidth
          margin="normal"
          label="שינוי סיסמא"
          type="password"
          name="userpPassword"
          value={details.userpPassword}
          onChange={handleChange}
          variant="outlined"
          className='register-textfield'
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          type="submit"
        >
          אישור
        </Button>
      </form>
      {EfooterS}
    </>
  );
}
