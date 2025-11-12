import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getToken, removeAuthTokens } from '../../services/localStorageService';
import { Client } from '@stomp/stompjs'; // Thêm
import SockJS from 'sockjs-client';      // Thêm
import { jwtDecode } from 'jwt-decode';
import './styles.css';

// URL Gốc của API Backend
const API_BASE_URL = "http://localhost:8080/safetyconstruction/api";
// URL Gốc của WebSocket
const WS_BASE_URL = "http://localhost:8080/safetyconstruction/ws";

const menuItems = [
  {
    path: '/',
    name: 'Dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    path: '/cctv',
    name: 'CCTV',
    icon: 'fas fa-video'
  },
  {
    path: '/history',
    name: 'History',
    icon: 'fa-solid fa-clock-rotate-left'
  },
  {
    path: '/multi-cctv',
    name: 'Multi CCTV',
    icon: 'fas fa-th'
  },
  {
    path: '/statistics',
    name: 'Statistics',
    icon: 'fas fa-chart-line'
  },
  {
    path: '/manage',
    name: 'Manage',
    icon: 'fas fa-cog'
  }
];

const Navbar = () => {
  const location = useLocation();
  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Dùng 'useRef' để giữ kết nối WebSocket
  const stompClientRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      try {
        // Giải mã token để lấy 'sub' (thường là username hoặc user ID)
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub); // 'sub' là Subject (ID của User)
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        handleLogout(); // Đăng xuất nếu token hỏng
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return; // Chỉ chạy khi đã có user ID

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notifications/my-notifications`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await response.json();
        if (data.code === 1000) {
          const alerts = data.result.content;
          setNotifications(alerts);
          // Đếm số lượng 'read = false'
          setUnreadCount(alerts.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Lỗi tải thông báo cũ:", err);
      }
    };
    
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!userId) return; // Chỉ chạy khi đã có user ID

    // Khởi tạo Stomp Client
    const client = new Client({
      // Dùng SockJS
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket: Đã kết nối!');
        
        // Lắng nghe (Subscribe) kênh (topic) của riêng user này
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          console.log("WebSocket: Nhận được thông báo mới!");
          const newNotification = JSON.parse(message.body);
          
          // Thêm thông báo mới vào đầu danh sách
          setNotifications(prev => [newNotification, ...prev]);
          // Tăng bộ đếm chưa đọc
          setUnreadCount(prev => prev + 1);
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket lỗi:', frame);
      },
    });

    // Kích hoạt kết nối
    client.activate();
    stompClientRef.current = client; // Lưu lại để cleanup

    // Cleanup: Ngắt kết nối khi component bị unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log('WebSocket: Đã ngắt kết nối.');
      }
    };
  }, [userId]);

  const handleLogout = async () => {
    const token = getToken();
    
    // 1. Gọi API Backend (để vô hiệu hóa token)
    try {
      if (token) {
        // (Gửi token hiện tại để backend vô hiệu hóa nó)
        await authApiProtected.logout({ token: token }); 
      }
    } catch (error) {
      // Bỏ qua lỗi (ví dụ: token đã hết hạn),
      // vì chúng ta vẫn muốn đăng xuất ở frontend
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      // 2. Ngắt kết nối WebSocket
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }

      // 3. Xóa token (Dùng hàm chuẩn)
      removeAuthTokens(); // (Hàm này xóa 'access_token' VÀ 'refresh_token')
      
      // 4. Cập nhật state
      setIsAuthenticated(false);
      setNotifications([]);
      setUnreadCount(0);
      setUserId(null);

      // 5. Chuyển hướng về Login (Dùng window.location để tải lại hoàn toàn)
      window.location.href = '/login';
    }
  };

  const markAsRead = async (notificationId) => {
    // 1. Cập nhật UI ngay lập tức
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    
    // 2. Gọi API để cập nhật backend
    try {
      await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    // 1. Cập nhật UI ngay lập tức
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
    
    // 2. Gọi API (endpoint mới)
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả đã đọc:", err);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-brand">
          <span>SSIMS.AI</span>
        </div>
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="authenticated-actions">
              <div className="notification-container"> 
                <button
                  className="notification-btn"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                
                {isNotificationOpen && (
                  <div className="notification-panel">
                    <div className="notification-header">
                      <span>Thông báo</span>
                      {/* THÊM NÚT MỚI */}
                      {unreadCount > 0 && (
                        <button 
                          className="mark-all-read-btn"
                          onClick={handleMarkAllAsRead}
                        >
                          Đánh dấu tất cả là đã đọc
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="notification-item empty">Không có thông báo.</div>
                      ) : (
                        notifications.map(noti => (
                          <div 
                            key={noti.id} 
                            className={`notification-item ${!noti.read ? 'unread' : ''}`}
                            onClick={() => !noti.read && markAsRead(noti.id)}
                          >
                            <div className="notification-title">{noti.title}</div>
                            <div className="notification-body">{noti.body}</div>
                            <div className="notification-time">
                              {new Date(noti.createdAt).toLocaleString('vi-VN')}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="profile-dropdown">
                <Link to="/profile" className="header-profile-btn">
                  <i className="fas fa-user-circle"></i>
                </Link>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <nav className="sidebar">
        <div className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span className="tooltip">{item.name}</span>
            </Link>
          ))}
        </div>
        {isAuthenticated && (
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;