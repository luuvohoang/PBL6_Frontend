import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import StatisticsSearch from '../components/Statistics/StatisticsSearch';
import Chart from '../components/Statistics/Chart';
import { projectsApi, statisticsApi } from '../services/api'; // ✅ Dùng service API
import '../assets/styles/statistics.css';

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Statistics = () => {
  const navigate = useNavigate();
  const [token] = useState(getToken());

  // --- State dữ liệu ---
  const [projects, setProjects] = useState([]);
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);

  // --- State giao diện ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1️⃣ Kiểm tra xác thực
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // 2️⃣ Tải danh sách Projects
  useEffect(() => {
    if (!token) return;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await projectsApi.getAll(); // ✅ dùng service
        const data = res.data;
        if (data.code !== 1000) throw new Error(data.message);
        setProjects(data.result.content || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  // 3️⃣ Xử lý tìm kiếm
  const handleSearch = async (searchParams) => {
    if (!searchParams.projectId) {
      alert('Vui lòng chọn một dự án.');
      return;
    }

    setLoading(true);
    setError(null);

    // Tạo query object (thay vì thủ công)
    const params = { ...searchParams };
    if (params.happenedAfter)
      params.happenedAfter = new Date(params.happenedAfter).toISOString();
    if (params.happenedBefore)
      params.happenedBefore = new Date(params.happenedBefore).toISOString();

    try {
      // ✅ Gọi 2 API song song qua service
      const [resType, resWeekday] = await Promise.all([
        statisticsApi.getByType(params),
        statisticsApi.getByWeekday(params),
      ]);

      const dataType = resType.data;
      const dataWeekday = resWeekday.data;

      if (dataType.code !== 1000) throw new Error(dataType.message);
      if (dataWeekday.code !== 1000) throw new Error(dataWeekday.message);

      // Cập nhật dữ liệu biểu đồ
      setPieData(formatDataForPieChart(dataType.result));
      setBarData(formatDataForBarChart(dataWeekday.result));
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ Render
  if (loading && projects.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="statistics-page">
      <div className="wrapper">
        <div className="box-title">
          <span>Onsite Statistics</span>
        </div>

        <div className="box-content">
          <div className="box-searchs">
            <StatisticsSearch projects={projects} onSearch={handleSearch} />
          </div>

          <div className="report">
            {error && <Typography color="error">Lỗi: {error}</Typography>}
            {loading && <CircularProgress />}
            <div className="chart">
              <Chart pieData={pieData} barData={barData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper format dữ liệu ---
const formatDataForPieChart = (apiData) => {
  if (!apiData || apiData.length === 0) return null;
  return {
    labels: apiData.map((d) => d.group),
    datasets: [
      {
        label: '# of Violations',
        data: apiData.map((d) => d.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      },
    ],
  };
};

const formatDataForBarChart = (apiData) => {
  if (!apiData) return null;
  const labels = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const data = new Array(7).fill(0);
  apiData.forEach((item) => {
    const dayIndex = item.group - 1;
    if (dayIndex >= 0 && dayIndex < 7) data[dayIndex] = item.count;
  });
  return {
    labels,
    datasets: [
      {
        label: 'Số vi phạm theo ngày',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };
};

export default Statistics;
