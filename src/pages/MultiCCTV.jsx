import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService'; // Giả sử bạn có file này
import { Box, CircularProgress, Typography } from '@mui/material'; // Dùng UI giống Profile
import Sidebar from '../components/MultiCCTV/Sidebar';
import CCTVGrid from '../components/MultiCCTV/CCTVGrid';
import '../assets/styles/multi_cctv.css';

// URL Gốc của API Backend
const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";

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
        const response = await fetch(`${API_BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.code !== 1000) throw new Error(data.message);
        
        const projectList = data.result.content || [];
        setProjects(projectList); 
        
        // --- SỬA LỖI 2: Đặt 'activeSection' một cách thông minh ---
        if (projectList.length > 0) {
          // Tự động chọn dự án ĐẦU TIÊN làm mặc định
          setActiveSection(projectList[0].id); 
        } else {
          // Nếu user không thuộc dự án nào, quay về 'View All'
          // (Nó sẽ gọi API /api/cameras và bị 403, nhưng đó là logic đúng)
          setActiveSection('cctv-view-all'); 
        }
        // --------------------------------------------------
        
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false); // Phải tắt loading nếu lỗi ở đây
      }
      // Không tắt loading ở đây, đợi useEffect 3 chạy xong
    };
    fetchProjects();
  }, [token]);

  useEffect(() => {
  if (!token) return;

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);

      setUserRole(data.result.role); // giả sử API trả về role ở đây
    } catch (err) {
      console.error("Error fetching user info:", err);
      setUserRole(null);
    }
  };

  fetchUser();
}, [token]);

  
  useEffect(() => {
    // SỬA LỖI 3: Chỉ chạy khi 'activeSection' đã được set (không còn là null)
    if (!token || !activeSection) return; 

    const fetchCameras = async () => {
      setLoading(true);
      setError(null);
      let url = '';

      if (activeSection === 'cctv-view-all') {
        url = `${API_BASE_URL}/cameras`; // (Sẽ bị 403 nếu user không phải ADMIN)
      } else if (activeSection === 'show-bookmark') {
        setCameras(bookmarkedItems);
        setLoading(false);
        return;
      } else {
        // activeSection là một ID của Project (ví dụ: 1)
        url = `${API_BASE_URL}/projects/${activeSection}/cameras`; 
      }

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // KIỂM TRA LỖI 403 (Forbidden)
        if (response.status === 403) {
            throw new Error("You do not have permission to view these cameras.");
        }
        
        const data = await response.json();
        if (data.code !== 1000) throw new Error(data.message);
        
        setCameras(data.result.content);
      } catch (err) {
        console.error('Error fetching cameras:', err.message);
        setError(err.message);
      }
      setLoading(false);
    };

    fetchCameras();
    // Bỏ 'projects' và 'bookmarkedItems' khỏi dependency array
  }, [activeSection, token]);// Chạy lại khi section thay đổi

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