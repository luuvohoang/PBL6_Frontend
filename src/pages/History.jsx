import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import SearchForm from '../components/History/SearchForm';
import HistoryTable from '../components/History/HistoryTable';
import '../assets/styles/history.css';

// --- SỬA LỖI: IMPORT API SERVICE ---
import { projectsApi, camerasApi, alertsApi } from '../services/api'; 
// (Giả sử file apiService.js của bạn được đổi tên thành 'api.js')

// (Xóa API_BASE_URL, vì apiService đã có)

const History = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());

  // (Các state Dữ liệu và Giao diện giữ nguyên)
  const [projects, setProjects] = useState([]);
  const [camerasInProject, setCamerasInProject] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCameras, setLoadingCameras] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);

  // 1. Kiểm tra xác thực (Giữ nguyên)
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 2. Tải danh sách Projects (SỬA LẠI)
  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      setLoadingProjects(true);
      setError(null);
      try {
        // --- SỬA LỖI: Dùng projectsApi (đã có interceptor) ---
        // (Không cần 'headers', interceptor tự làm)
        const response = await projectsApi.getAll(); 
        const data = response.data; // axios trả về trong 'data'
        // --------------------------------------------------

        if (data.code !== 1000) throw new Error(data.message);
        setProjects(data.result.content || []);
      } catch (err) {
        // Interceptor đã xử lý 401
        console.error('Error fetching projects:', err);
        setError(err.response ? err.response.data.message : err.message);
      }
      setLoadingProjects(false);
    };

    fetchProjects();
  }, [token]);

  /**
   * 3. Tải danh sách camera (SỬA LẠI)
   */
  const handleProjectChange = async (projectId) => {
    if (!projectId) {
      setCamerasInProject([]);
      return;
    }
    
    setLoadingCameras(true);
    try {
        // --- SỬA LỖI: Dùng camerasApi (đã có interceptor) ---
      const response = await camerasApi.getAllByProject(projectId);
      const data = response.data;
        // --------------------------------------------------
      if (data.code !== 1000) throw new Error(data.message);
      setCamerasInProject(data.result.content || []);
    } catch (err) {
      console.error('Error fetching cameras:', err);
      setError(err.response ? err.response.data.message : err.message);
    }
    setLoadingCameras(false);
  };

  /**
   * 4. Xử lý tìm kiếm (SỬA LẠI)
   */
  const handleSearch = async (searchParams) => {
    // Tách projectId ra khỏi các query params khác
    const { projectId, ...params } = searchParams;

    if (!projectId) {
      setError("Vui lòng chọn một dự án.");
      return;
    }
    
    setLoadingSearch(true);
    setError(null);

    // Chuyển đổi ngày sang ISO String (nếu tồn tại)
    if (params.happenedAfter) {
      params.happenedAfter = new Date(params.happenedAfter).toISOString();
    }
    if (params.happenedBefore) {
      params.happenedBefore = new Date(params.happenedBefore).toISOString();
    }
    
    try {
        // --- SỬA LỖI: Dùng alertsApi (đã có interceptor) ---
        // (axios sẽ tự động xử lý params)
      const response = await alertsApi.searchByProject(projectId, params);
      const data = response.data;
        // --------------------------------------------------
      if (data.code !== 1000) throw new Error(data.message);
      setAlerts(data.result.content || []); // Lưu kết quả tìm kiếm
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response ? err.response.data.message : err.message);
    }
    setLoadingSearch(false);
  };

  // --- Render Logic (Giữ nguyên) ---
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
            data={alerts}
            isLoading={loadingSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default History;