// File: src/components/Statistics/StatisticsSearch.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Giả sử các file này tồn tại
import { getToken } from '../../services/localStorageService'; 
const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";

const StatisticsSearch = ({ projects, onSearch }) => {
  // --- State của Form ---
  const [projectId, setProjectId] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [happenedAfter, setHappenedAfter] = useState(null);
  const [happenedBefore, setHappenedBefore] = useState(null);
  const [severity, setSeverity] = useState('');
  
  // --- State để tải camera ---
  const [cameras, setCameras] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(false);

  // Tải (fetch) cameras khi projectId thay đổi
  useEffect(() => {
    if (!projectId) {
      setCameras([]);
      setCameraId(''); // Reset lựa chọn camera
      return;
    }
    const fetchCameras = async () => {
      setLoadingCameras(true);
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/cameras`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.code === 1000) {
          setCameras(data.result.content || []);
        }
      } catch (err) {
        console.error("Error fetching cameras for stats:", err);
      }
      setLoadingCameras(false);
    };
    fetchCameras();
  }, [projectId]); // Chạy lại khi projectId thay đổi


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId) {
      alert("Vui lòng chọn một Dự án (Project).");
      return;
    }
    // Gọi 'onSearch' (từ cha) với object chứa tất cả bộ lọc
    onSearch({
      projectId,
      cameraId: cameraId || null,
      happenedAfter,
      happenedBefore,
      severity: severity || null
    });
  };

  return (
    <div className="box-searchs">
      <div className="item-title">
        <h3>Search Statistics</h3>
        <p>Filter statistics by project, camera, and date range</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project:</label>
          <select 
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">-- Select Project --</option>
            {/* Lặp qua 'projects' (từ props) */}
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Camera:</label>
          <select
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            disabled={!projectId || loadingCameras}
          >
            <option value="">-- All Cameras --</option>
            {loadingCameras ? <option>Loading...</option> :
              // Lặp qua 'cameras' (đã tải về)
              cameras.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            }
          </select>
        </div>
        
        <div className="form-group">
          <label>Severity:</label>
          <select value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="">-- All --</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label>From Date:</label>
          <DatePicker
            selected={happenedAfter}
            onChange={date => setHappenedAfter(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select start date"
          />
        </div>

        <div className="form-group">
          <label>To Date:</label>
          <DatePicker
            selected={happenedBefore}
            onChange={date => setHappenedBefore(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select end date"
            minDate={happenedAfter}
          />
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default StatisticsSearch;