import axios from 'axios';
// import apiClient from './apiClient';

// 1. ĐỊNH NGHĨA URL
// (URL này phải trỏ đến backend Spring Boot, bao gồm cả context-path nếu có)
const API_BASE_URL = 'http://localhost:8080/safetyconstruction';

// Tạo "instance" (phiên bản) axios cho API (dùng /api)
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // URL gốc cho API (ví dụ: /api/projects)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tạo "instance" axios riêng cho Auth (dùng /auth)
// Chúng ta dùng cái này để Refresh, tránh bị lặp vô tận (infinite loop)
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`, // URL gốc cho Auth (ví dụ: /auth/refresh)
  headers: {
    'Content-Type': 'application/json'
  }
});


// 2. BỘ CHẶN REQUEST (GẮN TOKEN)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. BỘ CHẶN RESPONSE (TỰ ĐỘNG REFRESH VÀ ĐĂNG XUẤT)
let isRefreshing = false;
let failedQueue = []; // Hàng đợi các request bị lỗi 401

// Hàm xử lý hàng đợi
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error); // Báo lỗi cho các request đang chờ
    } else {
      prom.resolve(token); // Cung cấp token mới cho các request đang chờ
    }
  });
  failedQueue = [];
};

// 4. BỘ CHẶN RESPONSE (ĐÃ NÂNG CẤP)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 (và không phải là lỗi từ chính 'authApi')
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu đang có 1 request khác refresh rồi, HÃY CHỜ
      if (isRefreshing) {
        try {
          // Tạo một Promise mới để "tạm dừng" request này
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Khi token mới về, gắn nó vào và thử lại
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Đây là request 401 đầu tiên -> Khóa lại và bắt đầu refresh
      originalRequest._retry = true;
      isRefreshing = true; 

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No refresh token");

        const rs = await authApi.post('/refresh', { token: refreshToken });

        const { token: newAccessToken, refreshToken: newRefreshToken } = rs.data.result;

        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        
        // Gắn token mới vào header
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Xử lý hàng đợi: Báo cho các request khác (đang chờ) biết token mới
        processQueue(null, newAccessToken);

        // Gửi lại request gốc
        return api(originalRequest);
        
      } catch (_error) {
        
        // Xử lý hàng đợi: Báo cho các request khác (đang chờ) biết là refresh đã hỏng
        processQueue(_error, null);
        
        // (Logic đăng xuất)
        console.error("Refresh token failed, logging out:", _error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
        
        return Promise.reject(_error);
      } finally {
        isRefreshing = false; // Mở "khóa"
      }
    }

    // Trả về các lỗi khác (403, 404, 500...)
    return Promise.reject(error);
  }
);

// 4. XUẤT (EXPORT) CÁC API CỦA BẠN

// === PROJECT API ===
export const projectsApi = {
  getAll: (pageable) => api.get('/projects', { params: pageable }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

// === CAMERA API ===
export const camerasApi = {
  getAllGlobal: (pageable) => api.get('/cameras', { params: pageable }),
  getAllByProject: (projectId, pageable) => 
    api.get(`/projects/${projectId}/cameras`, { params: pageable }),
  create: (projectId, data) => api.post(`/projects/${projectId}/cameras`, data),
  delete: (projectId, cameraId) => api.delete(`/projects/${projectId}/cameras/${cameraId}`),
  update: (cameraId, data) => api.put(`/cameras/${cameraId}`, data) // (Giả sử bạn có API này)
};

// === ALERT API ===
export const alertsApi = {
  searchGlobal: (params) => api.get('/alerts', { params }),
  getByIdGlobal: (alertId) => api.get(`/alerts/${alertId}`),
  reviewGlobal: (alertId, data) => api.patch(`/alerts/${alertId}/review`, data),
  
  searchByProject: (projectId, params) => 
    api.get(`/projects/${projectId}/alerts`, { params }),
  getByIdProject: (projectId, alertId) => 
    api.get(`/projects/${projectId}/alerts/${alertId}`),
  reviewByProject: (projectId, alertId, data) => 
    api.patch(`/projects/${projectId}/alerts/${alertId}/review`, data)
};

// === USER API (CÒN THIẾU) ===
export const userApi = {
  getAll: (pageable) => api.get('/users', { params: pageable }),
  getMyInfo: () => api.get('/users/myInfo'),
  create: (data) => api.post('/users', data),
  update: (userId, data) => api.put(`/users/${userId}`, data),
  delete: (userId) => api.delete(`/users/${userId}`)
};

// === ROLE API (CÒN THIẾU) ===
export const roleApi = {
  getAll: () => api.get('/roles'),
  create: (data) => api.post('/roles', data),
  update: (roleName, data) => api.put(`/roles/${roleName}`, data),
  delete: (roleName) => api.delete(`/roles/${roleName}`)
};

// === PERMISSION API (CÒN THIẾU) ===
export const permissionApi = {
  getAll: () => api.get('/permissions'),
  create: (data) => api.post('/permissions', data),
  delete: (permName) => api.delete(`/permissions/${permName}`)
};

// === NOTIFICATION API (CÒN THIẾU) ===
export const notificationApi = {
  getMyNotifications: (pageable) => api.get('/notifications/my-notifications', { params: pageable }),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all')
};

// === STATISTICS API (CÒN THIẾU) ===
export const statisticsApi = {
  // 'params' là AlertSearchRequest
  getByType: (params) => api.get('/statistics/by-type', { params }),
  getByWeekday: (params) => api.get('/statistics/by-weekday', { params })
};

// === DASHBOARD API (CÒN THIẾU) ===
export const dashboardApi = {
  // 'params' là AlertSearchRequest (để lọc)
  getData: (params) => api.get('/dashboard', { params })
};

// === AUTH API (Chỉ các API cần token) ===
export const authApiProtected = {
  logout: (data) => api.post('/auth/logout', data), // Dùng 'api' vì cần token
  introspect: (data) => api.post('/auth/introspect', data) // Dùng 'api' vì cần token
};
export const usersApi = {
  getMyInfo: () => api.get('/users/myInfo'),
};
// Xuất (export) 'api' (instance chính) nếu bạn cần dùng nó ở nơi khác
export default api;