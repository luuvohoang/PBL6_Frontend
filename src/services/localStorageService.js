// File: src/services/localStorageService.js

// Tên khóa (key) nhất quán
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Hàm lưu CẢ HAI token
export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Hàm lấy Access Token
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Hàm lấy Refresh Token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Hàm Xóa (cho Logout)
export const removeAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};