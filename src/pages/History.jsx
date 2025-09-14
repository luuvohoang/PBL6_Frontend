import { useState, useEffect } from 'react';
import SearchForm from '../components/History/SearchForm';
import HistoryTable from '../components/History/HistoryTable';
// import './styles.css';
import '../assets/styles/history.css';

const History = () => {
  const [cameraProjects, setCameraProjects] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCameraProjects();
  }, []);

  const fetchCameraProjects = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/camera-projects');
      const data = await response.json();
      setCameraProjects(data);
    } catch (error) {
      console.error('Error fetching camera projects:', error);
    }
  };

  const handleSearch = async (searchData) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });
      const data = await response.json();
      setErrorData(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="box-title">
        <h1>Detection History</h1>
      </div>
      
      <div className="box-content">
        <SearchForm 
          cameraProjects={cameraProjects}
          onSearch={handleSearch}
        />

        <div className="box-inquiry">
          <div className="item-title">
            <h3>Detection History Inquiry</h3>
            <span className="span-nd">Information After Query</span>
          </div>
          
          <HistoryTable 
            data={errorData} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default History;