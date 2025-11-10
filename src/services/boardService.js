import axios from 'axios';

const BASE_URL = 'http://localhost:8080/safetyconstruction/api';

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};