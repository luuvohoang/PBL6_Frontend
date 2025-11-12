import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService'; // Giả sử bạn có file này
import { Box, CircularProgress, Typography } from '@mui/material'; // Dùng UI giống Profile
import Sidebar from '../components/MultiCCTV/Sidebar';
import CCTVGrid from '../components/MultiCCTV/CCTVGrid';
import '../assets/styles/multi_cctv.css';

// URL Gốc của API Backend
import { projectsApi, camerasApi } from '../services/api';

const MultiCCTV = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());

  // --- State dữ liệu ---
  const [projects, setProjects] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [userRole, setUserRole] = useState(null);
  
  // --- State giao diện ---
  
  // SỬA LỖI 1: Đặt state mặc định là 'null' (chưa chọn gì)
  const [activeSection, setActiveSection] = useState(null); 
  
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 2. Tải danh sách Projects (SỬA LỖI 2)
  useEffect(() => {
    if (!token) return;
    
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- SỬA LỖI: Dùng projectsApi (đã có interceptor) ---
        // (Không cần 'headers', interceptor tự làm)
        const response = await projectsApi.getAll(); 
        const data = response.data; // axios trả về trong 'data'
        // --------------------------------------------------
        
        if (data.code !== 1000) throw new Error(data.message);
        
        const projectList = data.result.content || [];
        setProjects(projectList); 
        
        // (Logic 'activeSection' thông minh giữ nguyên)
        if (projectList.length > 0) {
          setActiveSection(projectList[0].id); 
        } else {
          setActiveSection('cctv-view-all'); 
        }
        
      } catch (err) {
        // Interceptor đã xử lý 401
        console.error('Error fetching projects:', err);
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

//   useEffect(() => {
//   if (!token) return;

//   const fetchUser = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (data.code !== 1000) throw new Error(data.message);

//       setUserRole(data.result.role); // giả sử API trả về role ở đây
//     } catch (err) {
//       console.error("Error fetching user info:", err);
//       setUserRole(null);
//     }
//   };

//   fetchUser();
// }, [token]);

  
  useEffect(() => {
    if (!token || !activeSection) return; 

    const fetchCameras = async () => {
      setLoading(true);
      setError(null);
      
      // (Biến 'url' không còn cần thiết)

      try {
        // --- SỬA LỖI: Dùng camerasApi ---
        let response;
        if (activeSection === 'cctv-view-all') {
          response = await camerasApi.getAllGlobal(); // Gọi API Toàn cục
        } else if (activeSection === 'show-bookmark') {
          setCameras(bookmarkedItems);
          setLoading(false);
          return;
        } else {
          response = await camerasApi.getAllByProject(activeSection); // Gọi API lồng nhau
        }
        // ---------------------------------
        
        const data = response.data; // axios trả về trong 'data'
        if (data.code !== 1000) throw new Error(data.message);
        
        setCameras(data.result.content);
      } catch (err) {
        // Interceptor đã xử lý 401
        console.error('Error fetching cameras:', err.message);
        setError(err.response ? err.response.data.message : err.message);
      }
      setLoading(false);
    };

    fetchCameras();
  }, [activeSection, token, bookmarkedItems]);

  // 4. Xử lý Bookmark (Sửa lại để dùng 'id')
  const handleBookmark = (camera) => {
    setBookmarkedItems(prev => {
      const exists = prev.find(item => item.id === camera.id);
      if (exists) {
        return prev.filter(item => item.id !== camera.id);
      }
      return [...prev, camera];
    });
  };

  // 5. Lấy Tiêu đề (SỬA LỖI 4)
  const getSectionTitle = (section) => {
    if (section === 'cctv-view-all') return 'CCTV View All';
    if (section === 'show-bookmark') return 'Show Bookmark';
    
    // Thêm kiểm tra 'projects' tồn tại
    if (projects.length > 0 && section) {
      const project = projects.find(p => p.id.toString() === section.toString());
      return project ? project.name.toUpperCase() : 'Loading Project...';
    }
    return 'Loading...'; // State ban đầu khi 'activeSection' là null
  };

  // --- Render Logic (SỬA LỖI 5) ---
  
  if (loading && !activeSection) { // Sửa: Dùng !activeSection
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return <Typography color="error">Lỗi: {error}</Typography>;
  }

  return (
    <div className="multicctv-page">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        projects={projects}
      />
      
      <div className="main-content-multi-cctv">
        <div className="content-header">
          <h1>{getSectionTitle(activeSection)}</h1>
        </div>
        
        {/* Hiển thị loading khi chuyển tab */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : error ? ( // Thêm: Hiển thị lỗi rõ ràng
           <Typography color="error" sx={{ padding: 4 }}>
             Lỗi: {error}
           </Typography>
        ) : (
          <CCTVGrid 
            cameras={cameras}
            bookmarkedItems={bookmarkedItems}
            onBookmark={handleBookmark}
          />
        )}
      </div>
    </div>
  );
};

export default MultiCCTV;