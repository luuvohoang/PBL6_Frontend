// File: src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import SearchForm from '../components/History/SearchForm';
import HistoryTable from '../components/History/HistoryTable';
import '../assets/styles/history.css';

// URL Gốc của API Backend
const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";

const History = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());

  // --- State Dữ liệu ---
  const [projects, setProjects] = useState([]);         // Danh sách dự án
  const [camerasInProject, setCamerasInProject] = useState([]); // Cameras trong dự án đang chọn
  const [alerts, setAlerts] = useState([]);             // Kết quả tìm kiếm (lịch sử)

  // --- State Giao diện ---
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCameras, setLoadingCameras] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);

  // 1. Kiểm tra xác thực (Giống Profile.jsx)
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 2. Tải danh sách Projects (Dự án) khi component được tải
  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      setLoadingProjects(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await fetch(`${API_BASE_URL}/projects`, { headers });
        const data = await response.json();
        if (data.code !== 1000) throw new Error(data.message);
        setProjects(data.result.content || []); // Dùng .content vì là Page
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      }
      setLoadingProjects(false);
    };

    fetchProjects();
  }, [token]);

  /**
   * 3. Được gọi bởi SearchForm khi người dùng CHỌN một Dự án.
   * Tải danh sách camera cho dự án đó.
   */
  const handleProjectChange = async (projectId) => {
    if (!projectId) {
      setCamerasInProject([]); // Xóa danh sách camera nếu bỏ chọn
      return;
    }
    
    setLoadingCameras(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/cameras`, { headers });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      setCamerasInProject(data.result.content || []);
    } catch (err) {
      console.error('Error fetching cameras:', err);
      setError(err.message);
    }
    setLoadingCameras(false);
  };

  /**
   * 4. Được gọi bởi SearchForm khi người dùng nhấn "Search".
   * 'searchParams' là object: { projectId, cameraId, happenedAfter, happenedBefore }
   */
  const handleSearch = async (searchParams) => {
    if (!searchParams.projectId) {
      setError("Vui lòng chọn một dự án.");
      return;
    }
    
    setLoadingSearch(true);
    setError(null);

    // Chuyển đổi params thành query string
    // (Backend AlertSearchRequest mong đợi các query param)
    const params = new URLSearchParams();
    
    // (projectId không cần, vì nó đã nằm trong URL)
    if (searchParams.cameraId) params.append('cameraId', searchParams.cameraId);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.severity) params.append('severity', searchParams.severity);
    if (searchParams.status) params.append('status', searchParams.status);
    
    // Chuyển đổi ngày sang định dạng ISO 8601 (Instant)
    if (searchParams.happenedAfter) {
      params.append('happenedAfter', new Date(searchParams.happenedAfter).toISOString());
    }
    if (searchParams.happenedBefore) {
      params.append('happenedBefore', new Date(searchParams.happenedBefore).toISOString());
    }
    
    // URL API (dùng API lồng nhau của Project)
    const url = `${API_BASE_URL}/projects/${searchParams.projectId}/alerts?${params.toString()}`;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(url, { headers });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      setAlerts(data.result.content || []); // Lưu kết quả tìm kiếm
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message);
    }
    setLoadingSearch(false);
  };

  if (loadingProjects) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="wrapper">
      <div className="box-title">
        <h1>Detection History</h1>
      </div>
      
      <div className="box-content">
        <SearchForm 
          projects={projects}
          cameras={camerasInProject}
          loadingCameras={loadingCameras}
          onProjectChange={handleProjectChange}
          onSearch={handleSearch}
        />
        
        {error && <Typography color="error" sx={{ mt: 2 }}>Lỗi: {error}</Typography>}

        <div className="box-inquiry">
          <div className="item-title">
            <h3>Detection History Inquiry</h3>
            <span className="span-nd">Information After Query</span>
          </div>
          
          <HistoryTable 
            data={alerts} // Truyền 'alerts' (kết quả tìm kiếm)
            isLoading={loadingSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default History;