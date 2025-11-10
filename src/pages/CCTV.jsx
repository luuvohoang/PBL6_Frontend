import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import '../assets/styles/cctv.css';

// --- HÀM TRỢ GIÚP MỚI ---
/**
 * Chuyển đổi link YouTube (ví dụ: /watch?v=) sang link Embed (/embed/)
 * @param {string} url - Link YouTube gốc từ CSDL
 * @returns {string} - Link đã được chuyển đổi để nhúng vào iframe
 */
const convertYouTubeUrlToEmbed = (url) => {
  if (!url) return '';
  
  let videoId = '';
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'youtu.be') {
      // Xử lý link rút gọn (ví dụ: https://youtu.be/VIDEO_ID)
      videoId = urlObj.pathname.substring(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      // Xử lý link xem (ví dụ: https://www.youtube.com/watch?v=VIDEO_ID)
      videoId = urlObj.searchParams.get('v');
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`; // Thêm autoplay và mute
    }
  } catch (error) {
    console.error("Link YouTube không hợp lệ:", url, error);
    return '';
  }
  
  return url; // Trả về URL gốc nếu không thể phân tích
};
// -------------------------


const CCTV = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());
  
  const [projects, setProjects] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // SỬA: State này giờ sẽ lưu link YouTube GỐC
  const [selectedCameraUrl, setSelectedCameraUrl] = useState(''); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";

  // 1. Kiểm tra xác thực
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 2. Tải danh sách Dự án (Projects)
  useEffect(() => {
    if (!token) return;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.code !== 1000) throw new Error(data.message);
        
        const projectList = data.result.content;
        setProjects(projectList);
        
        if (projectList.length > 0) {
          setSelectedProjectId(projectList[0].id);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [token]);

  // 3. Tải Cameras và Alerts khi Dự án (Project) thay đổi
  useEffect(() => {
    if (!token || !selectedProjectId) return;
    const fetchDataForProject = async () => {
      setLoading(true);
      try {
        // Tải Cameras
        const camResponse = await fetch(
          `${API_BASE_URL}/projects/${selectedProjectId}/cameras`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const camData = await camResponse.json();
        if (camData.code !== 1000) throw new Error(camData.message);
        
        const cameraList = camData.result.content;
        setCameras(cameraList);

        // Tự động chọn camera đầu tiên (lưu link YouTube gốc)
        if (cameraList.length > 0) {
          setSelectedCameraUrl(cameraList[0].rtspUrl); // 'rtspUrl' giờ là link YouTube
        } else {
          setSelectedCameraUrl('');
        }

        // Tải Alerts
        const alertResponse = await fetch(
          `${API_BASE_URL}/projects/${selectedProjectId}/alerts?size=10&sort=happenedAt,desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const alertData = await alertResponse.json();
        if (alertData.code !== 1000) throw new Error(alertData.message);
        setAlerts(alertData.result.content);

      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err.message);
      }
      setLoading(false);
    };
    fetchDataForProject();
  }, [selectedProjectId, token]);

  // 4. Cập nhật đồng hồ
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Xử lý sự kiện ---
  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };
  
  const handleCameraChange = (e) => {
    setSelectedCameraUrl(e.target.value);
  };
  
  // SỬA: Chuyển đổi link YouTube gốc sang link Embed
  const videoEmbedUrl = convertYouTubeUrlToEmbed(selectedCameraUrl);

  // --- Render Logic ---
  if (loading && !projects.length) {
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
        <span>CCTV</span>
      </div>
      
      <div className="box-content">
        <div className="content-top">
          {/* --- KHU VỰC CHỌN CAMERA --- */}
          <div className="box-cctv">
            <form className="box-selects">
              <div className="selectss">
                <div className="select2">
                  <select 
                    className="customSelect"
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* CHỌN CAMERA */}
                <div className="select1">
                  <select 
                    className="customSelect"
                    value={selectedCameraUrl} // Value là link YouTube gốc
                    onChange={handleCameraChange}
                  >
                    {cameras.map(camera => (
                      <option key={camera.id} value={camera.rtspUrl}> {/* Value là link YouTube gốc */}
                        {camera.name} ({camera.location})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* CHỌN DỰ ÁN (PROJECT) */}
                
              </div>
            </form>

            <div className="cctv">
              {/* SỬA: Dùng `videoEmbedUrl` đã được chuyển đổi */}
              {videoEmbedUrl ? (
                <iframe 
                  className="video-cctv"
                  frameBorder="0"
                  src={videoEmbedUrl} // Dùng link Embed
                  width="100%"
                  height="100%"
                  // Thêm các quyền này cho YouTube
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="CCTV Stream"
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography>Vui lòng chọn camera</Typography>
                </Box>
              )}
            </div>
          </div>

          {/* --- KHU VỰC LỊCH SỬ --- */}
          <div className="box-history">
            {/* (Phần đồng hồ và nút 'View in Details' giữ nguyên) */}
            <div className="box-date-time">
                {/* ... (code đồng hồ của bạn) ... */}
            </div>

            <div className="box-detection-history">
              <div className="history-title">
                <h3 className="history-title-p">Detection History (Alerts)</h3>
              </div>
              <div className="history-list">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Error Type (Loại)</th>
                      <th>Severity (Mức độ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <tr key={alert.id}>
                          <td>{new Date(alert.happenedAt).toLocaleTimeString()}</td>
                          <td>{alert.type}</td>
                          <td>{alert.severity}</td>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTV;