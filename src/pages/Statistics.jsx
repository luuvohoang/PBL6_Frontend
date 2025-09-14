import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import StatisticsSearch from '../components/Statistics/StatisticsSearch';
import DetectionHistory from '../components/Statistics/DetectionHistory';
import Chart from '../components/Statistics/Chart';
import "react-datepicker/dist/react-datepicker.css";
import '../assets/styles/statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    statis1: [],
    statis2: [], 
    statis3: []
  });
  const [cameraProjects, setCameraProjects] = useState([]);
  const [errors, setErrors] = useState([]);
  const [errorTypeCounts, setErrorTypeCounts] = useState({});

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  const fetchStatisticsData = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      
      setStatistics({
        statis1: data.statis1,
        statis2: data.statis2,
        statis3: data.statis3
      });
      setCameraProjects(data.cameraProjects);
      setErrors(data.errors);

      // Calculate error type counts
      const counts = {};
      data.errors?.forEach(error => {
        counts[error.error_type] = (counts[error.error_type] || 0) + 1;
      });
      setErrorTypeCounts(counts);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSearch = async (searchData) => {
    try {
      const response = await fetch('/api/statistics/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      const data = await response.json();
      setErrors(data.errors);
      // Update other relevant state...
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="statistics-page">
      <div className="wrapper">
        <div className="box-title">
          <span>Onsite Statistics</span>
        </div>

        <div className="box-content">
          <div className="box-searchs">
            <StatisticsSearch 
              cameras={cameraProjects}
              onSearch={handleSearch}
            />
            
            <DetectionHistory errors={errors} />
          </div>

          <div className="report">
            <span>Detailed report in 'Detection History'</span>
            <div className="chart">
              <Chart 
                statistics={statistics}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;