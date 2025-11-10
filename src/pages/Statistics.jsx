import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import StatisticsSearch from '../components/Statistics/StatisticsSearch';
import Chart from '../components/Statistics/Chart'; // Component con (xem Bước 2)
import '../assets/styles/statistics.css';

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// URL Gốc của API Backend
const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";

const Statistics = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());

  // --- State Dữ liệu ---
  const [projects, setProjects] = useState([]); // Danh sách dự án
  const [pieData, setPieData] = useState(null); // Dữ liệu cho biểu đồ tròn (by-type)
  const [barData, setBarData] = useState(null); // Dữ liệu cho biểu đồ cột (by-weekday)

  // --- State Giao diện ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Kiểm tra xác thực (Giống Profile.jsx)
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 2. Tải (fetch) danh sách Projects (Dự án)
  useEffect(() => {
    if (!token) return;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await fetch(`${API_BASE_URL}/projects`, { headers });
        const data = await response.json();
        if (data.code !== 1000) throw new Error(data.message);
        setProjects(data.result.content || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [token]);

  /**
   * 3. Xử lý tìm kiếm (Được gọi từ StatisticsSearch)
   * searchParams là object: { projectId, happenedAfter, ... }
   */
  const handleSearch = async (searchParams) => {
    if (!searchParams.projectId) {
      alert("Vui lòng chọn một dự án.");
      return;
    }

    setLoading(true);
    setError(null);
    
    // Xây dựng query string từ searchParams
    const params = new URLSearchParams();
    params.append('projectId', searchParams.projectId);
    if (searchParams.cameraId) params.append('cameraId', searchParams.cameraId);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.severity) params.append('severity', searchParams.severity);
    if (searchParams.status) params.append('status', searchParams.status);
    if (searchParams.happenedAfter) params.append('happenedAfter', new Date(searchParams.happenedAfter).toISOString());
    if (searchParams.happenedBefore) params.append('happenedBefore', new Date(searchParams.happenedBefore).toISOString());

    const queryString = params.toString();

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Gọi song song 2 API thống kê
      const [resType, resWeekday] = await Promise.all([
        fetch(`${API_BASE_URL}/statistics/by-type?${queryString}`, { headers }),
        fetch(`${API_BASE_URL}/statistics/by-weekday?${queryString}`, { headers })
      ]);

      const dataType = await resType.json();
      const dataWeekday = await resWeekday.json();

      if (dataType.code !== 1000) throw new Error(dataType.message);
      if (dataWeekday.code !== 1000) throw new Error(dataWeekday.message);

      // 4. Format dữ liệu cho Chart.js
      setPieData(formatDataForPieChart(dataType.result));
      setBarData(formatDataForBarChart(dataWeekday.result));

    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message);
    }
    setLoading(false);
  };

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
            {/* Truyền 'projects' đã tải xuống 'StatisticsSearch' */}
            <StatisticsSearch 
              projects={projects}
              onSearch={handleSearch}
            />
            {/* Xóa: DetectionHistory (đã có ở trang History.jsx) */}
          </div>

          <div className="report">
            {error && <Typography color="error">Lỗi: {error}</Typography>}
            {loading && <CircularProgress />}
            
            <div className="chart">
              {/* Truyền dữ liệu đã format cho component Chart */}
              <Chart 
                pieData={pieData}
                barData={barData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HÀM HỖ TRỢ FORMAT BIỂU ĐỒ ---

/**
 * Chuyển đổi dữ liệu API (by-type) sang định dạng Pie Chart
 * Input: [ { group: "NO_HELMET", count: 5 }, { group: "NO_VEST", count: 2 } ]
 */
const formatDataForPieChart = (apiData) => {
  if (!apiData || apiData.length === 0) return null;

  return {
    labels: apiData.map(d => d.group), // ["NO_HELMET", "NO_VEST"]
    datasets: [
      {
        label: '# of Violations',
        data: apiData.map(d => d.count), // [5, 2]
        backgroundColor: [ // Tự động tạo màu
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

/**
 * Chuyển đổi dữ liệu API (by-weekday) sang định dạng Bar Chart
 * Input: [ { group: 2, count: 3 }, { group: 4, count: 4 } ]
 * (Giả định SQL DAYOFWEEK(): 1=CN, 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7)
 */
const formatDataForBarChart = (apiData) => {
  if (!apiData) return null;

  const labels = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const data = new Array(7).fill(0); // [0, 0, 0, 0, 0, 0, 0]

  // Đặt 'count' vào đúng vị trí trong mảng
  apiData.forEach(item => {
    const dayIndex = item.group - 1; // (group 1 (CN) -> index 0)
    if (dayIndex >= 0 && dayIndex < 7) {
      data[dayIndex] = item.count;
    }
  });

  return {
    labels,
    datasets: [
      {
        label: 'Số vi phạm theo ngày',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };
};

export default Statistics;