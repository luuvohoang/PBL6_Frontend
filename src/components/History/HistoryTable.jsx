import React from 'react';

// Hàm trợ giúp để format ngày (đặt bên ngoài component)
const formatTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  // Chuyển đổi sang định dạng ngày/giờ Việt Nam
  return new Date(isoString).toLocaleString('vi-VN', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const HistoryTable = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading...</div>; // Giữ nguyên
  }

  // Sửa: 'data' bây giờ là mảng 'alerts'
  const alerts = data;

  return (
    <div className="inquiry">
      <table>
        <thead>
          {/* SỬA: Tên các cột (columns) */}
          <tr>
            <th>ID</th>
            <th>Thời gian (Time)</th>
            <th>Loại (Type)</th>
            <th>Mức độ (Severity)</th>
            <th>Trạng thái (Status)</th>
            <th>Camera ID</th>
            <th>Ghi chú (Review Note)</th>
          </tr>
        </thead>
        <tbody>
          {/* SỬA: Dùng tên trường (fields) từ AlertResponse DTO */}
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <tr key={alert.id}>
                <td>{alert.id}</td>
                <td>{formatTimestamp(alert.happenedAt)}</td>
                <td>{alert.type}</td>
                <td>{alert.severity}</td>
                <td>{alert.alertStatus}</td>
                <td>{alert.cameraId || 'N/A'}</td>
                <td>{alert.reviewNote || ''}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No alerts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;