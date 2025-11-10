import axios from 'axios';

// // 1. SỬA LẠI BASE_URL
// const BASE_URL = 'http://localhost:8080/safetyconstruction/api';

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

const API_BASE_URL = 'http://localhost:8080/safetyconstruction/api';

// Tạo "instance" axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. THÊM INTERCEPTOR (BẮT BUỘC)
// Interceptor này tự động gắn Token (JWT) vào MỌI yêu cầu
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token'); // Giả sử bạn lưu token với tên này
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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

api.interceptors.response.use(
  (response) => {
    // Nếu request thành công, trả về
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Token hết hạn) VÀ chưa thử lại
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu là đã thử lại

      try {
        // Cố gắng lấy refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error("No refresh token"); // Nếu không có, đi thẳng đến 'catch'
        }

        // Gọi API /auth/refresh (dùng axios gốc, không dùng 'api' để tránh lặp vô tận)
        const rs = await axios.post(
          'http://localhost:8080/safetyconstruction/auth/refresh', // URL đầy đủ
          { token: refreshToken }
        );

        // Lấy access token MỚI và lưu
        const { token: newAccessToken } = rs.data.result;
        localStorage.setItem('access_token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Gửi lại request gốc (đã bị lỗi)
        return api(originalRequest); 
        
      } catch (_error) {
        
        // --- ĐÂY LÀ LOGIC ĐĂNG XUẤT BẠN CẦN ---
        // Nếu refresh thất bại (Refresh Token cũng hết hạn)
        console.error("Refresh token failed, logging out:", _error);
        
        // 1. Xóa token (Đăng xuất)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // 2. Chuyển hướng về trang Login
        window.location.href = '/login'; 
        // ------------------------------------
        
        return Promise.reject(_error);
      }
    }

    // Trả về các lỗi khác (404, 500...)
    return Promise.reject(error);
  }
);

// 3. XUẤT (EXPORT) CÁC API CỦA BẠN
// (Sử dụng cấu trúc của bạn, rất tốt!)

export const projectsApi = {
  // GET /api/projects
  getAll: (pageable) => api.get('/projects', { params: pageable }), // Thêm pageable
  
  // GET /api/projects/{id}
  getById: (id) => api.get(`/projects/${id}`),
  
  // POST /api/projects
  create: (data) => api.post('/projects', data),
  
  // PUT /api/projects/{id}
  update: (id, data) => api.put(`/projects/${id}`, data),
  
  // DELETE /api/projects/{id}
  delete: (id) => api.delete(`/projects/${id}`)
};

export const camerasApi = {
  // GET /api/cameras (Toàn cục)
  getAllGlobal: (pageable) => api.get('/cameras', { params: pageable }),
  
  // GET /api/projects/{projectId}/cameras
  getAllByProject: (projectId, pageable) => 
    api.get(`/projects/${projectId}/cameras`, { params: pageable }),
    
  // POST /api/projects/{projectId}/cameras
  create: (projectId, data) => api.post(`/projects/${projectId}/cameras`, data),
  
  // DELETE /api/projects/{projectId}/cameras/{cameraId}
  delete: (projectId, cameraId) => api.delete(`/projects/${projectId}/cameras/${cameraId}`)
};

export const alertsApi = {
  // GET /api/alerts (Admin)
  searchGlobal: (params) => api.get('/alerts', { params }), // params là AlertSearchRequest
  
  // GET /api/projects/{projectId}/alerts (User)
  searchByProject: (projectId, params) => 
    api.get(`/projects/${projectId}/alerts`, { params }),
    
  // PATCH /api/projects/{projectId}/alerts/{alertId}/review
  review: (projectId, alertId, data) => 
    api.patch(`/projects/${projectId}/alerts/${alertId}/review`, data)
};

// (Bạn có thể thêm usersApi, rolesApi, ... ở đây)

export default api;