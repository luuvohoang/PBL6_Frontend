import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, Card, CircularProgress, Typography, Button } from '@mui/material';
import '../assets/styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  const getUserDetails = async (accessToken) => {
    try {
      const response = await fetch(
        "http://localhost:8080/safetyconstruction/users/myInfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message);
      }
      setUserDetails(data.result);
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
    } else {
      getUserDetails(accessToken);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor={"#f0f2f5"}
    >
      <Card
        sx={{
          minWidth: 400,
          maxWidth: 500,
          boxShadow: 4,
          borderRadius: 4,
          padding: 4,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          User Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold">Username:</Typography>
            <Typography>{userDetails.name}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold">Email:</Typography>
            <Typography>{userDetails.email}</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Profile;