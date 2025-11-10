import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm
import { getToken } from '../services/localStorageService'; // Thêm
import { Chart as ChartJS } from 'chart.js/auto'; // Giữ nguyên
import { Bar } from 'react-chartjs-2'; // Giữ nguyên
import { Box, CircularProgress, Typography, Card, CardContent } from '@mui/material'; // Thêm
import '../assets/styles/dashboard.css';

// URL Gốc của API Backend
const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());

  // --- State mới, khớp với DashboardResponse DTO ---
  const [summary, setSummary] = useState(null);
  const [weekdayStats, setWeekdayStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  // State đã được xử lý (format) cho biểu đồ
  const [formattedMonthlyData, setFormattedMonthlyData] = useState({});
  
  // --- State giao diện ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Kiểm tra xác thực
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // 2. Tải (fetch) dữ liệu Dashboard
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        // SỬA: Gọi API mới, không có query param (để lấy toàn cục)
        const response = await fetch(`${API_BASE_URL}/dashboard`, { headers }); 
        const data = await response.json();

        if (data.code !== 1000) throw new Error(data.message);

        // Giải nén (unwrap) 'result' (DashboardResponse)
        const result = data.result;
        setSummary(result.summary);
        setWeekdayStats(result.weekdayStats || []);
        setMonthlyStats(result.monthlyStats || []);
        setRecentAlerts(result.recentAlerts.content || []); // Dùng .content vì là Page

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [token]);

  // 3. Xử lý dữ liệu 'monthlyStats' (khi nó thay đổi)
  // Chuyển đổi mảng [{ group: "TYPE", counts: [...] }] 
  // thành đối tượng { "TYPE": [...] } mà biểu đồ cũ mong đợi
  useEffect(() => {
    if (monthlyStats.length > 0) {
      const formattedData = monthlyStats.reduce((acc, item) => {
        acc[item.group] = item.counts; // group = "BODY", "AREA", v.v.
        return acc;
      }, {});
      setFormattedMonthlyData(formattedData);
    }
  }, [monthlyStats]);

  // --- Các hàm trợ giúp (Helpers) ---

  // Hàm này tìm mảng 'counts' (7 ngày) cho 1 loại vi phạm cụ thể
  const findWeekdayData = (type) => {
    // (Giả sử SQL trả về 1=CN, 2=T2... và JS Chart.js là 0=T2...)
    // Để đơn giản, ta giả định backend đã trả về đúng thứ tự [T2, T3, T4, T5, T6, T7, CN]
    // Nếu không, bạn cần hàm formatDataForBarChart như ở Statistics.jsx
    
    // Tìm trong mảng weekdayStats
    const stats = weekdayStats.find(s => s.group === type);
    return stats ? stats.counts : [0, 0, 0, 0, 0, 0, 0]; // Trả về mảng 7 số 0 nếu không tìm thấy
  };
  
  // Hàm format thời gian (cho bảng History)
  const formatTimestamp = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  // Giữ nguyên phần cấu hình chung của biểu đồ
const chartOptions = {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

// Nhãn trục X cho các biểu đồ tuần
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Bộ màu cố định cho từng cột trong các biểu đồ
const chartColors = {
  backgroundColor: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(128, 128, 128, 0.2)',
    'rgba(153, 102, 255, 0.2)'
  ],
  borderColor: [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(128, 128, 128)',
    'rgb(153, 102, 255)'
  ]
};

// Hàm sinh màu ngẫu nhiên (giữ nguyên logic cũ)
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};



  // --- Render Logic ---
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Lỗi: {error}</Typography>;
  }

  return (
    <div className="wrapper">
      <div className="box-title">
        <span>Dashboard</span>
      </div>
      
      {/* THÊM MỚI: Thẻ Tóm tắt (Summary Cards) */}
      <div className="summary-cards-container">
        <Card className="summary-card">
          <CardContent>
            <Typography variant="h5">{summary?.totalAlerts || 0}</Typography>
            <Typography color="textSecondary">Tổng Cảnh báo (Total Alerts)</Typography>
          </CardContent>
        </Card>
        <Card className="summary-card warning">
          <CardContent>
            <Typography variant="h5">{summary?.unresolvedAlerts || 0}</Typography>
            <Typography color="textSecondary">Chưa xử lý (Unresolved)</Typography>
          </CardContent>
        </Card>
        <Card className="summary-card critical">
          <CardContent>
            <Typography variant="h5">{summary?.highSeverityAlerts || 0}</Typography>
            <Typography color="textSecondary">Mức độ Cao/Nghiêm trọng</Typography>
          </CardContent>
        </Card>
      </div>
      
      {/* SỬA: Biểu đồ theo tuần */}
      <div className="box-notification">
        {/* Biểu đồ 1 (Giả sử type là 'BODY') */}
        <div className="notifications">
          <div className="item-title-notification">
            <h5>Weekly Emergency Notification Detection</h5>
            <p>Worker Collapsed & Crash (BODY)</p>
          </div>
          <div className="item-statistics">
            <div className="Chart">
              <Bar 
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'BODY Detections',
                    data: findWeekdayData('BODY'), // SỬA: Lấy dữ liệu động
                    ...chartColors
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Biểu đồ 2 (Giả sử type là 'RESTRICTED_AREA_ENTRY') */}
        <div className="notifications">
          <div className="item-title-notification">
            <h5>Weekly Danger Notification Detection</h5>
            <p>Entry into Hazardous Area (AREA)</p>
          </div>
          <div className="item-statistics">
            <div className="chart">
              <Bar 
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'Area Detections',
                    data: findWeekdayData('RESTRICTED_AREA_ENTRY'), // SỬA: Lấy dữ liệu động
                    ...chartColors
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Biểu đồ 3 (Giả sử type là 'NO_HELMET') */}
        <div className="notifications">
          <div className="item-title-notification">
            <h5>Weekly Warning Notification Detection</h5>
            <p>Hard hat Non-Compliance (NO_HELMET)</p>
          </div>
          <div className="item-statistics">
            <div className="chart">
              <Bar 
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'No Helmet Detections',
                    data: findWeekdayData('NO_HELMET'), // SỬA: Lấy dữ liệu động
                    ...chartColors
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SỬA: Bảng Lịch sử và Biểu đồ Tháng */}
      <div className="box-histore">
        {/* Bảng Lịch sử (Dùng 'recentAlerts') */}
        <div className="detection-history">
          <div className="title-detection-history">
            <h4>Recent Detections (Cảnh báo mới nhất)</h4>
          </div>
          <div className="list-detection-history">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type (Loại)</th>
                  <th>Severity (Mức độ)</th>
                </tr>
              </thead>
              <tbody>
                {/* SỬA: Dùng 'recentAlerts' và tên trường DTO */}
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((item) => (
                    <tr key={item.id}>
                      <td>{formatTimestamp(item.happenedAt)}</td>
                      <td>{item.type}</td>
                      <td>{item.severity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No errors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biểu đồ Tháng (Dùng 'formattedMonthlyData') */}
        <div className="box-report">
          <div className="monthly-report">
            <div className="title-monthly-report">
              <h4>Monthly Report</h4>
            </div>
            <div>
              <Bar
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  // SỬA: Dùng 'formattedMonthlyData' đã được xử lý
                  datasets: Object.keys(formattedMonthlyData).map(errorType => ({
                    label: errorType,
                    data: formattedMonthlyData[errorType],
                    backgroundColor: getRandomColor(),
                  }))
                }}
                options={{
                  scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                  plugins: { 
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Stacked Column Chart with Annotations'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;