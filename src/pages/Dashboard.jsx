import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import '../assets/styles/dashboard.css';

const Dashboard = () => {
  const [detectionData, setDetectionData] = useState({
    detections1: [],
    detections2: [],
    detections3: [],
    monthlyReportData: {},
    detectiveHistory: []
  });

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/dashboard-data');
        const data = await response.json();
        setDetectionData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

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

  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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

  return (
    <div className="wrapper">
      <div className="box-title">
        <span>Dashboard</span>
      </div>
      
      <div className="box-notification">
        {/* Emergency Notification */}
        <div className="notifications">
          <div className="item-title-notification">
            <h5>Weekly Emergency Notification Detection</h5>
            <p>Worker Collapsed & Crash</p>
          </div>
          <div className="item-statistics">
            <div className="data"></div>
            <div className="Chart">
              <Bar 
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'Body Detections',
                    data: detectionData.detections1,
                    backgroundColor: chartColors.backgroundColor,
                    borderColor: chartColors.borderColor,
                    borderWidth: 1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Danger Notification */}
        <div className="notifications">
          <div className="item-title-notification">
            <h5>Weekly Danger Notification Detection</h5>
            <p>Entry into Hazardous Area</p>
          </div>
          <div className="item-statistics">
            <div className="data"></div>
            <div className="chart">
              <Bar 
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'Area Detections',
                    data: detectionData.detections2,
                    backgroundColor: chartColors.backgroundColor,
                    borderColor: chartColors.borderColor,
                    borderWidth: 1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Warning Notification */}
        <div className="notifications">
          <div className="item-title-notification">
            <h5>Weekly Warning Notification Detection</h5>
            <p>Hard hat Non-Compliance & No Signalman</p>
          </div>
          <div className="item-statistics">
            <div className="data"></div>
            <div className="chart">
              <Bar 
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'Machine Detections',
                    data: detectionData.detections3,
                    backgroundColor: chartColors.backgroundColor,
                    borderColor: chartColors.borderColor,
                    borderWidth: 1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="box-histore">
        {/* Detection History */}
        <div className="detection-history">
          <div className="title-detection-history">
            <h4>Detection History</h4>
          </div>
          <div className="list-detection-history">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Detection</th>
                </tr>
              </thead>
              <tbody>
                {detectionData.detectiveHistory?.length > 0 ? (
                  detectionData.detectiveHistory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.timestamp}</td>
                      <td>{item.descripts}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No errors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Report */}
        <div className="box-report">
          <div className="monthly-report">
            <div className="title-monthly-report">
              <h4>Monthly Report</h4>
            </div>
            <div>
              <Bar
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'],
                  datasets: Object.keys(detectionData.monthlyReportData).map(errorType => ({
                    label: errorType,
                    data: detectionData.monthlyReportData[errorType],
                    backgroundColor: getRandomColor(),
                    borderColor: getRandomColor(),
                    borderWidth: 1
                  }))
                }}
                options={{
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                  },
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

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

export default Dashboard;