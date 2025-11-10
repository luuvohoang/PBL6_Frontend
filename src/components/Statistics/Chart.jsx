// File: src/components/Statistics/Chart.jsx
import React from 'react';
// Cần import Pie và Bar
import { Pie, Bar } from 'react-chartjs-2'; 
import { Box, Typography } from '@mui/material';

// (Đảm bảo file Statistics.jsx (cha) đã đăng ký ChartJS)
// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);


const Chart = ({ pieData, barData }) => {
  
  // Tùy chọn cho biểu đồ cột
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Số lượng vi phạm theo ngày trong tuần',
      },
    },
  };
  
  // Tùy chọn cho biểu đồ tròn
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Tỷ lệ các loại vi phạm',
      },
    },
  };

  return (
    <Box className="chart-container" sx={{ display: 'flex', gap: '2rem', width: '100%' }}>
      
      {/* Biểu đồ tròn (By Type) */}
      <Box sx={{ width: '40%' }}>
        {pieData ? (
          <Pie data={pieData} options={pieOptions} />
        ) : (
          <Typography>Chưa có dữ liệu cho biểu đồ tròn.</Typography>
        )}
      </Box>
      
      {/* Biểu đồ cột (By Weekday) */}
      <Box sx={{ width: '60%' }}>
        {barData ? (
          <Bar options={barOptions} data={barData} />
        ) : (
          <Typography>Chưa có dữ liệu cho biểu đồ cột.</Typography>
        )}
      </Box>

    </Box>
  );
};

export default Chart;