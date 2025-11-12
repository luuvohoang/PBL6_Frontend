import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CircularProgress, Typography, Button } from '@mui/material';
import { getToken } from '../services/localStorageService';
import { usersApi } from '../services/api'; // ✅ Dùng API service
import '../assets/styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();

  // --- State ---
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Hàm logout ---
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // --- Hàm lấy thông tin user ---
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Gọi API từ service
      const response = await usersApi.getMyInfo();
      const data = response.data;

      if (data.code !== 1000) {
        throw new Error(data.message);
      }

      setUserDetails(data.result);
    } catch (err) {
      console.error('Error fetching user info:', err);
      if (err.response?.status === 401 || err.message === 'No refresh token') {
        handleLogout(); // token hết hạn hoặc lỗi refresh → logout
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Kiểm tra token và fetch dữ liệu ---
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }
  }, [navigate]);

  // --- Giao diện loading ---
  if (loading) {
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

  // --- Giao diện lỗi ---
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error" mb={2}>
          Lỗi: {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </Box>
    );
  }

  // --- Giao diện chính ---
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f0f2f5"
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight="bold">Username:</Typography>
            <Typography>{userDetails?.name || "N/A"}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight="bold">Email:</Typography>
            <Typography>{userDetails?.email || "N/A"}</Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="error"
          sx={{ mt: 4, width: "100%" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Card>
    </Box>
  );
};

export default Profile;
